import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidBar from "../components/SidBar";
import { IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MdOutlineDashboard } from "react-icons/md";
import { IoSettingsOutline, IoHelpBuoyOutline } from "react-icons/io5";
import { GiCardboardBoxClosed, GiCardboardBox } from "react-icons/gi";
import { LuShoppingCart, LuUsers2 } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  
  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const drawerContent = (
    <List>
      <NavLink to="" onClick={handleLinkClick}>
        <ListItem button>
          <ListItemIcon>
            <MdOutlineDashboard size={25} />
          </ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
      </NavLink>
      <NavLink to="/products" onClick={handleLinkClick}>
        <ListItem button>
          <ListItemIcon>
            <GiCardboardBoxClosed size={25} />
          </ListItemIcon>
          <ListItemText primary="Produits" />
        </ListItem>
      </NavLink>
      <NavLink to="/Commandes" onClick={handleLinkClick}>
        <ListItem button>
          <ListItemIcon>
            <LuShoppingCart size={25} />
          </ListItemIcon>
          <ListItemText primary="Commandes" />
        </ListItem>
      </NavLink>
      <NavLink to="/stock" onClick={handleLinkClick}>
        <ListItem button>
          <ListItemIcon>
            <GiCardboardBox size={25} />
          </ListItemIcon>
          <ListItemText primary="Gestion de stock" />
        </ListItem>
      </NavLink>
      <NavLink to="/utilisateurs" onClick={handleLinkClick}>
        <ListItem button>
          <ListItemIcon>
            <LuUsers2 size={25} />
          </ListItemIcon>
          <ListItemText primary="Utilisateurs" />
        </ListItem>
      </NavLink>
      <NavLink to="/parameters" onClick={handleLinkClick}>
        <ListItem button>
          <ListItemIcon>
            <IoSettingsOutline size={25} />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </NavLink>
      <NavLink to="/aide" onClick={handleLinkClick}>
        <ListItem button>
          <ListItemIcon>
            <IoHelpBuoyOutline size={25} />
          </ListItemIcon>
          <ListItemText primary="Aide et supports" />
        </ListItem>
      </NavLink>
    </List>
  );

  return (
    <div className="flex h-screen m-0 p-0">
  <div className="hidden lg:block w-[20%]">
    <SidBar />
  </div>
  <div className="lg:hidden p-4">
    <IconButton
      edge="start"
      color="inherit"
      aria-label="menu"
      onClick={handleDrawerToggle}
      className="relative"
    >
      <MenuIcon className="text-3xl" />
    </IconButton>
  </div>
  <Drawer
    variant="temporary"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{
      keepMounted: true,
    }}
    className="lg:hidden"
  >
    {drawerContent}
  </Drawer>
  <div className="w-full lg:w-[80%] m-0 p-0 h-full ">
    <Outlet />
  </div>
</div>

  );
};

export default Layout;
