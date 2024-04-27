import { Outlet } from "react-router-dom";

import MainNavigation from '../../shared/MainNavigation/MainNavigation';

const RootLayout = (props) => {

    return (
        <>
        <MainNavigation/>
        <Outlet/>
        </>
    );

}

export default RootLayout;