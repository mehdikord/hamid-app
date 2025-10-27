const Reminders_Routes = [
    {
        path: '/reminders',
        name: 'reminders',
        component: () => import('@/views/reminders/Reminders.vue'),
        meta: {
            title: 'یاداور ها ',
            requiresAuth: true
        }
    }
];

export default Reminders_Routes;
