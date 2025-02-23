import React from 'react';
import HomeBanner from '../../components/clients/home/HomeBanner';
import HomeBranches from '../../components/clients/home/HomeBranches';
import HomePackage from '../../components/clients/home/packageGymZ/HomePackage';
import HomeDiscount from '../../components/clients/home/HomeDiscount';
import HomeTopProduct from '../../components/clients/home/topProductHome/HomeTopProduct';
import HomeNews from '../../components/clients/home/newsHome/HomeNews';

const Home = () => {
    return (
        <div>
            {/* <h1>Đây là trang Home</h1> */}
            <HomeBanner />
            <HomeBranches/>
            <hr className="my-10 mx-16 border-t border-gray-300" />
            <HomePackage />
            <HomeDiscount />
            <HomeTopProduct />
            <HomeNews />
        </div>
    );
};

export default Home;