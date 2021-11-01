import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#282828',
          secondary: '#EDEDED',
          accent: '#FF8000',
          error: '#FF3F0D',
          info: '#4CB7EB',
          success: '#4CB7EB',
          warning: '#FF8000'
        },
      },
    },
});
