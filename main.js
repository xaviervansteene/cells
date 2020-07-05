import Vue from 'vue';
import technicalTest from './src/views/cells.vue';
import 'bootstrap';


new Vue({ render: createElement => createElement(technicalTest) }).$mount('#app');
