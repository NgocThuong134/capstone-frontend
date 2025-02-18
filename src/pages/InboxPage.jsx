import React, { useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer';
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import UserInbox from './UserInbox';


const InboxPage = () => {
    const [active, setActive] = useState(4);
    return (
        <div>
            <Header />
            <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
                <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
                    <ProfileSideBar active={active} setActive={setActive} />
                </div>
                <UserInbox active={active}/>
            </div>
            <Footer />
        </div>
    )
}

export default InboxPage