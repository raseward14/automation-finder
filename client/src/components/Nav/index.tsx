import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    const logout = async () => {
        console.log('clicked');
        try {
            // an api request to logout
            // possibly clear creds from session storage if there
            // window.location.reload(false);
            // console.log(response.data)
            console.log('try block executed')
        } catch (err) {
            console.log(`got an error ${err}`)
            // if(!err.response) {
            //     setErrMsg('No server response...')
            // } else if (err?.response) {
            //     console.log(err.response)
            // } else {
            //     console.log('you are logged out!')
            // }
        }
    };

    return (
    <ul>
        <table>
            <tbody>
                <tr>
                    <td><Link to='/oauth'>Connect ClickUp</Link></td>
                </tr>
                <tr>
                    <td><Link to='/automations'>Automations</Link></td>
                </tr>
                <tr>
                    <td><Link to='/' onClick={logout}>Logout</Link></td>
                </tr>
            </tbody>
        </table>
    </ul>
    );
};

export default Nav;