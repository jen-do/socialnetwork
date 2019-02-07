import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/">
            <img id="logo" src="/images/logo.jpg" alt="logo" />
        </Link>
    );
}
