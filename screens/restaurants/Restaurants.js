import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import { isUserLogged } from '../../utils/actions'

export default function Restaurants() {    
    const [user, setUser] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setUser(user)
        })
    }, [])

    if(user === null){
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
            <Text>Restaurants</Text>
            {
                user && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#0e4f5c"
                        reverse
                        containerStyle={styles.btnContainer}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {width: 2, height:2 },
        shadowOpacity: 0.5
    }
})
