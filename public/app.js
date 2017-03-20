Vue.component('new-comment-form', {
  template: `
    <form class="submit-comment" @submit.prevent="onSubmit">
      <input v-model="form.email" type="email" placeholder="Email">
      <textarea v-model="form.message" placeholder="Message"></textarea>
      <div class="text-right">
        <button type="submit">Submit</button>
      </div>
    </form>
  `,
  data: function() {
    return {
      form: {
        email: '',
        message: ''
      }
    }
  },
  methods: {
    onSubmit: function() {
      console.log('onSubmit', this.form);
    }
  }
})

Vue.component('comments-feed', {
  props: ['comments'],
  template: `
    <div class="comments-feed">
      <input v-model="filter" type="text" placeholder="Filter">
      <comments-item v-for="comment in comments" :email="comment.email" :message="comment.message" :key="comment.id"></comments-item>
    </div>
  `,
  data: function() {
    return {
      filter: ''
    }
  }
})

Vue.component('comments-item', {
  props: ['email', 'message'],
  template: `
    <div class="comments-item">
      <img class="gravatar_img" :src="gravatar_link" />
      <div>
        <strong>{{ email }}</strong>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  computed: {
    gravatar_link: function() {
      return `https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=50`
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    comments: [
      {
        id: 'a1b2c3',
        email: 'elik@bigpanda.io',
        message: 'Hello there'
      }, {
        id: 'a1b2d4',
        email: 'Shai@bigpanda.io',
        message: 'Good!'
      }
    ]
  },
  mounted: function() {
    console.log('Vue is ready');
  }
});
