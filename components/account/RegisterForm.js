import { size } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import { validateEmail } from '../../utils/helpers'

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")

    const onChange = (e,type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const registerUser = () => {
        if (!validateData()){
            return
        }
        console.log("Full")
    }

    const validateData = () => {
        setErrorConfirm("")
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if (!validateEmail(formData.email)){
            setErrorEmail("Debes ingresar un email válido.")
            isValid = false
        }

        if(size(formData.password) < 6){
            setErrorPassword("Debes ingresar una contraseña de al menos seis caracteres.")
            isValid = false
        }

        if(size(formData.confirm) < 6){
            setErrorConfirm("Debes ingresar una confirmación de contraseña de al menos seis caracteres.")
            isValid = false
        }

        if(formData.password !== formData.confirm){
            setErrorPassword("Las contraseñas no coinciden")
            setErrorConfirm("Las contraseñas no coinciden")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.form}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu email..."
                onChange={(e) => onChange(e, "email")}
                keyboardType="email-address"
                errorMessage={errorEmail}
                defaultValue={formData.email}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña..."
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errorPassword}
                defaultValue={formData.password}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                containerStyle={styles.input}
                placeholder="Confirma tu contraseña..."
                password={true}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e, "confirm")}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button
                title="Registrar Nuevo Usuario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={() => registerUser()}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return {email: "", password: "", confirm: ""}
}

const styles = StyleSheet.create({
    form:{
        marginTop: 30
    },
    input: {
        width: "100%"
    },
    btnContainer:{
        marginTop: 20,
        width:"95%",
        alignSelf: "center"
    },
    btn:{
        backgroundColor: "#0e4f5c"
    },
    icon: {
        color: "#7fabb7"
    }
})