import BranchesFacilities from "../../components/clients/branches/branchesFacilities/BranchesFacilities";
import BranchesFlex from "../../components/clients/branches/BranchesFlex";
import BranchesSystem from "../../components/clients/branches/branchesSystem/BranchesSystem";
import BranchesVideo from "../../components/clients/branches/BranchesVideo";


const BranchesClient = () => {
    return (
        <div>
            {/* <h1>Đây là trang Branches</h1> */}
            <BranchesSystem />
            <BranchesFacilities />
            <BranchesVideo />
            <BranchesFlex />
        </div>
    );
};

export default BranchesClient;