import Customers from "@/views/customers/Customers.vue";
import Customers_Profile from "@/views/customers/Customers_Profile.vue";
import Customers_Consultant from "@/views/customers/Customers_Consultant.vue";
import Customers_Sellers from "@/views/customers/Customers_Sellers.vue";

const Customers_Routes = [
    {
        path : "/customers",
        name : 'customers',
        component : Customers,
        meta: { title: 'مشتریان' }
    },
    {
        path : "/customers/consultant",
        name : 'customers_consultant',
        component : Customers_Consultant,
        meta: { title: 'لیست شماره های در حال مشاوره' }
    },
    {
        path : "/customers/seller",
        name : 'customers_seller',
        component : Customers_Sellers,
        meta: { title: 'لیست شماره های در حال فروش' }
    },




    {
        path : "/customers/profile/:id",
        name : 'customers_profile',
        component : Customers_Profile,
        meta: { title: 'پروفایل مشتری', dynamicTitle: true }
    },
    {
        path : "/customers/profile/:id/reports",
        name : 'customers_profile_reports',
        component : Customers_Profile,
        meta: { title: 'گزارشات مشتری', dynamicTitle: true }
    },
    {
        path : "/customers/profile/:id/invoices",
        name : 'customers_profile_invoices',
        component : Customers_Profile,
        meta: { title: 'فاکتورهای مشتری', dynamicTitle: true }
    }
];

export default Customers_Routes;