import { AppBar, Toolbar, Typography } from "@mui/material";
import ThemeToggleSwitch from "../ThemeToggle/ThemeToggle";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

export default function Header(){
    return(
        <header>
            <AppBar>
                <Toolbar>
                    <Typography variant="h1" sx={{ flexGrow:0 }}>CoinVista</Typography>
                    <ThemeToggleSwitch/>
                    <LanguageDropdown/>
                </Toolbar>
            </AppBar>
        </header>
    );
};