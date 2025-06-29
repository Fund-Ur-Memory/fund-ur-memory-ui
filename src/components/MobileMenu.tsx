import { Fragment, useState } from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Collapse from "@mui/material/Collapse";
import { Link } from 'react-scroll';

// Define types for menu items
interface Submenu {
  title: string;
  link: string;
}

interface MenuItem {
  id: number;
  title: string;
  link: string;
  submenu?: Submenu[];
}

const menus: MenuItem[] = [
    {
        id: 1,
        title: 'Home',
        link: '/home_ico'
    }
];

const MobileMenu = () => {
    const [openId, setOpenId] = useState(0);

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    return (
        <List className="mobail-menu main_menu_list unordered_list text-uppercase">
            {menus.map((item, mn) => {
                return (
                    <ListItem className={item.id === openId ? 'active' : ''} key={mn}>
                        {item.submenu ? (
                            <Fragment>
                                <p onClick={() => setOpenId(item.id === openId ? 0 : item.id)}>
                                    {item.title}
                                    <i className={item.id === openId ? 'fa fa-angle-up' : 'fa fa-angle-down'}></i>
                                </p>
                                <Collapse in={item.id === openId} timeout="auto" unmountOnExit>
                                    <List className="menu-item menu-item-has-children active">
                                        <Fragment>
                                            {item.submenu.map((submenu: Submenu, i: number) => {
                                                return (
                                                    <ListItem key={i}>
                                                        <a 
                                                            onClick={ClickHandler} 
                                                            className="active"
                                                            href={submenu.link}
                                                        >
                                                            {submenu.title}
                                                        </a>
                                                    </ListItem>
                                                );
                                            })}
                                        </Fragment>
                                    </List>
                                </Collapse>
                            </Fragment>
                        ) : (
                            <a className="active" href={item.link}>
                                {item.title}
                            </a>
                        )}
                    </ListItem>
                );
            })}
            
            <List className='MuiList-root MuiList-padding css-h4y409-MuiList-root'>
                <ListItem>
                    <Link 
                        to="id_ico_about_section" 
                        spy={true} 
                        smooth={true} 
                        duration={500} 
                        offset={-100} 
                        className="nav-link scrollspy_btn"
                    >
                        <span className="nav_link_label" data-text="About Cipher">
                            About Cipher
                        </span>
                    </Link>
                </ListItem>
            </List>
            
            <List className='MuiList-root MuiList-padding css-h4y409-MuiList-root'>
                <ListItem>
                    <Link 
                        to="id_ico_service_section" 
                        spy={true} 
                        smooth={true} 
                        duration={500} 
                        offset={-100} 
                        className="nav-link scrollspy_btn"
                    >
                        <span className="nav_link_label" data-text="Features">
                            Features
                        </span>
                    </Link>
                </ListItem>
            </List>
        </List>
    );
};

export default MobileMenu;