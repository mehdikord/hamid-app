import Customers from "@/views/customers/Customers.vue";
import Customers_Profile from "@/views/customers/Customers_Profile.vue";
import Customers_Consultant from "@/views/customers/Customers_Consultant.vue";
import Customers_Sellers from "@/views/customers/Customers_Sellers.vue";

const Customers_Routes = [
    {
        path : "/customers",
        name : 'customers',
        component : Customers
    },
    {
        path : "/customers/consultant",
        name : 'customers_consultant',
        component : Customers_Consultant
    },
    {
        path : "/customers/seller",
        name : 'customers_seller',
        component : Customers_Sellers
    },




    {
        path : "/customers/profile/:id",
        name : 'customers_profile',
        component : Customers_Profile
    },
    {
        path : "/customers/profile/:id/reports",
        name : 'customers_profile_reports',
        component : Customers_Profile
    },
    {
        path : "/customers/profile/:id/invoices",
        name : 'customers_profile_invoices',
        component : Customers_Profile
    }
];

export default Customers_Routes;