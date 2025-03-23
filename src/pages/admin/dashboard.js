import React,  { useState, useEffect }  from 'react';
import Chart from "../../components/admin/analysis/chart"
import AnalysisCard from "../../components/admin/analysis/analysisCard"
import TopProduct from '../../components/admin/analysis/topProduct'
import { getCurrentDate  } from '../../components/utils/getCurrentDate';
import InventoryList from "../../components/admin/analysis/InventoryList";
import InventoryInput from '../../components/admin/analysis/InventoryInput';
const Dashboard = () => {
    const [currentDate, setCurrentDate] = useState(getCurrentDate());
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentDate(getCurrentDate());
        }, 1000 * 60); 
    
        return () => clearInterval(interval); // Xóa interval khi component unmount
      }, []);
    
    return (
        <div className='mt-20 w-5/6 mx-auto '>
            <h2 className="text-lg text-right font-semibold text-gray-700"> {currentDate}</h2>
            <AnalysisCard />
           <div className="flex w-5/6 mx-auto justify-between mt-5">
           {/* <Chart /> */}
           <InventoryList/>
           <TopProduct/>
           </div>
           {/* <InventoryInput/> */}

        </div>
    );
};

export default Dashboard;