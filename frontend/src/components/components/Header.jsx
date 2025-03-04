import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Box,
    styled
} from '@mui/material';

// Custom styled components using your color theme
const StyledAppBar = styled(AppBar)({
    backgroundColor: '#e4e4c1',
    color: '#684824',
});

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
});

const UserSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#684824',
});

const Header = ({ userName, userPhoto, onLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        onLogout();
    };
    console.log(userName)
    return (
        <StyledAppBar position="static">
            <StyledToolbar>
                <Typography variant="h6" style={{ fontFamily: 'revert-layer' }} component="div">
                    VINTAGE
                </Typography>

                <UserSection>
                    <Typography>{userName}</Typography>
                    <IconButton onClick={handleMenuOpen}>
                        <Avatar
                            src={userPhoto}
                            alt={userName}
                            sx={{
                                width: 40,
                                height: 40,
                                border: '2px solid #856c48'
                            }}
                        />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: '#c0b592',
                                '& .MuiMenuItem-root': {
                                    color: '#684824',
                                    '&:hover': {
                                        backgroundColor: '#a2906d',
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </UserSection>
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default Header;
