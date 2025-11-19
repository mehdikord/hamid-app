import Invoices from "@/views/invoices/Invoices.vue";

const Invoices_Routes = [
    {
        path : "/invoices",
        name : 'invoices',
        component : Invoices,
        meta: { title: 'فاکتور ها' }
    }
];

export default Invoices_Routes;

