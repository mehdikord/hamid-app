import Customers from "@/views/customers/Customers.vue";
import Customers_Profile from "@/views/customers/Customers_Profile.vue";

const Customers_Routes = [
    {
        path : "/customers",
        name : 'customers',
        component : Customers
    },
    {
        path : "/customers/profile/:id",
        name : 'customers_profile',
        component : Customers_Profile
    }
];

export default Customers_Routes;