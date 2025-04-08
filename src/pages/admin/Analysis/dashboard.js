import React,  { useState, useEffect }  from 'react';
import Chart from "../../../components/admin/analysis/chart"
import AnalysisCard from "../../../components/admin/analysis/analysisCard"
import TopProduct from '../../../components/admin/analysis/topProduct'
import { getCurrentDate  } from '../../../components/utils/getCurrentDate';
import InventoryList from "../../../components/admin/analysis/InventoryList";
import InventoryInput from '../../../components/admin/analysis/InventoryInput';
import  FrequentlyBoughtTogether  from "../../../components/admin/analysis/FrequentlyBoughtTogether";
import MemberChart from "../../../components/admin/analysis/MemberChart"
import MemberDistributionChart from "../../../components/admin/analysis/MemberDistributionChart"
import RevenueMemberChart from '../../../components/admin/analysis/RevenueMemberChart';
const Dashboard = () => {
    const [currentDate, setCurrentDate] = useState(getCurrentDate());
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentDate(getCurrentDate());
        }, 1000 * 60); 
    
        return () => clearInterval(interval); // Xóa interval khi component unmount
      }, []);
    
    return (
        <div className='mt-20 w-11/12 mx-auto '>
            <h2 className="text-lg text-right font-semibold text-gray-700"> {currentDate}</h2>
            <AnalysisCard />
           <div className="flex mx-auto border justify-between mt-5">
           {/* <Chart /> */}
           <InventoryList/>
           <TopProduct/>

           </div>
           <div className="flex mx-auto justify-around mt-5">
           <MemberChart/>
           <MemberDistributionChart/>
           </div>
           <FrequentlyBoughtTogether/>
        <RevenueMemberChart/>
           {/* <InventoryInput/> */}

        </div>
    );
};

export default Dashboard;