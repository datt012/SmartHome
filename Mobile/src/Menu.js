import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import React from "react";
import {Text} from "react-native";

const MenuForm = () => {
    return (
        <Menu>
            <MenuTrigger/>
            <MenuOptions>
                <MenuOption onSelect={() => alert(`Save`)} text='Save'/>
                <MenuOption onSelect={() => alert(`Delete`)}>
                    <Text style={{color: 'red'}}>Delete</Text>
                </MenuOption>
                <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled'/>
            </MenuOptions>
        </Menu>
    );

};

export default MenuForm;
