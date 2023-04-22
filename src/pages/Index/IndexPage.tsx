import { Link } from "react-router-dom";

import React from "react";

export const IndexPage: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </header>
        </div>
    );
};
