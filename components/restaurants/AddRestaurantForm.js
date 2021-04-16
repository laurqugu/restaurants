import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, StyleSheet, View, Text, ScrollView } from 'react-native'
import { Avatar, Button, Icon, Image, Input } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash'
import CountryPicker from 'react-native-country-picker-modal'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'

import { getCurrentLocation, loadImageFromGallery, validateEmail } from '../../utils/helpers'
import Modal from '../../components/Modal'
import { uploadImage } from '../../utils/actions'

const widthScreen = Dimensions.get("window").width

export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setImagesSelected] = useState("")
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addRestaurant = async() => {
        if (!validForm()){
            return
        }

        setLoading(true)
        const response = await uploadImages()
        console.log(response)

        setLoading(false)

        console.log("Funciona")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "restaurants", uuid())
                if (response.statusResponse){
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if (isEmpty(formData.name)){
            setErrorName("Debes ingresar el nombre del restaurante.")
            isValid = false
        }
        if (isEmpty(formData.address)){
            setErrorAddress("Debes ingresar la dirección del restaurante.")
            isValid = false
        }
        if (!validateEmail(formData.email)){
            setErrorEmail("Debes ingresar un email válido del restaurante.")
            isValid = false
        }
        if (size(formData.phone) < 10){
            setErrorPhone("Debes ingresar un número de teléfono válido del restaurante.")
            isValid = false
        }
        if (isEmpty(formData.description)){
            setErrorDescription("Debes ingresar una descripción del restaurante.")
            isValid = false
        }

        if (!locationRestaurant){
            toastRef.current.show("Debes de localizar el restaurante en el mapa", 3000)
        }else if (size(imagesSelected) === 0){
            toastRef.current.show("Debes de agregar al menos una imagen al restaurante en el mapa", 3000)
        }

        return isValid

    }

    const clearErrors = () => {
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorEmail(null)
        setErrorName(null)
        setErrorPhone(null)
    }


    return (
        <ScrollView style={styles.viewContainer}>
            <ImageRestaurant
                imageRestaurant={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}  
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}    
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}          
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapRestaurant({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }){
    const [newRegion, setNewRegion] = useState(null)

    useEffect(() => {
        (async()=> {
            const response = await getCurrentLocation()
            if (response.status){
                setNewRegion(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(newRegion)
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {
                    newRegion && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation
                            onRegionChange={(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    )
                }
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageRestaurant({ imageRestaurant }){
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: widthScreen, height: 200 }}
                source={
                    imageRestaurant
                        ? { uri: imageRestaurant }
                        : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4, 3])
        if(!response.status){
            toastRef.current.show("No has seleccionado ninguna imagen.", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estás seguro que quieres eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Si",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {
                cancelable: true
            }
        )
    }

    return(
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
            {
                size(imagesSelected) < 10 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#0e4f5c"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    /> 
                )
            }
            {
                map(imagesSelected, (imageRestaurant, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageRestaurant }}
                        onPress={() => removeImage(imageRestaurant)}
                    />
                ))           
            }
        </ScrollView>
    )
}

function FormAdd({ 
    formData, 
    setFormData, 
    errorName, 
    errorDescription, 
    errorEmail, 
    errorAddress, 
    errorPhone, 
    setIsVisibleMap,
    locationRestaurant
} ){
    const [country, setCountry] = useState("CO")
    const [callingCode, setCallingCode] = useState("57")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }
    
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del Restaurante"
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Dirección del Restaurante"
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#0e4f5c" : "#7fabb7",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                keyboardType="email-address"
                placeholder="Email del Restaurante"
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({                            
                            ...formData,
                            "country": country.cca2,
                            "callingCode": country.callingCode[0]
                        })
                    }}
                />
                <Input
                    placeholder="WhatsApp del restaurante..."
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                />
            </View>
                <Input
                    placeholder="Descripción del restaurante"
                    multiline
                    containerStyle={styles.textArea}
                    defaultValue={formData.description}
                    onChange={(e) => onChange(e, "description")}
                    errorMessage={errorDescription}
                />
        </View>
    )
}

const defaultFormValues = () => {
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "CO",
        callingCode: "57"
    }
}

const styles = StyleSheet.create({
    viewContainer:{
        height:"100%"
    },
    viewForm: {
        marginHorizontal: 10,
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width:"80%",
        flexDirection: "row"        
    },
    inputPhone: {
        width:"80%"
    },
    btnAddRestaurant: {
        margin: 20,
        backgroundColor: "#0e4f5c"
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30        
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#0e4f5c"
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#7fabb7"
    }
})