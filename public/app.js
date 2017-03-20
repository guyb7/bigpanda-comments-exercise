Vue.component('new-comment-form', {
  props: ['add-comment'],
  template: `
    <form class="submit-comment" @submit.prevent="onSubmit">
      <input v-model="form.email" type="email" placeholder="Email" :disabled="is_submitting">
      <textarea v-model="form.message" placeholder="Message" :disabled="is_submitting"></textarea>
      <div class="text-right">
        <button type="submit" :disabled="is_submitting">Submit</button>
      </div>
    </form>
  `,
  data: function() {
    return {
      is_submitting: false,
      form: {
        email: '',
        message: ''
      }
    }
  },
  methods: {
    onSubmit: function() {
      this.is_submitting = true
      var comment = Object.assign({}, this.form)
      axios.post('/api/add-comment', comment)
        .then(function (response) {
          this.is_submitting = false
          this.form.email = ''
          this.form.message = ''
          this.addComment(comment)
        }.bind(this))
    }
  }
})

Vue.component('comments-feed', {
  props: ['comments', 'is_fetching'],
  template: `
    <div class="comments-feed">
      <div class="filter-container">
        <search-icon></search-icon>
        <input v-model="filter" type="text" placeholder="Filter">
      </div>
      <comments-item v-for="comment in filtered_comments" :email="comment.email" :message="comment.message" :key="comment.id"></comments-item>
      <spinner v-if="is_fetching"></spinner>
      <p v-else-if="empty_comments" class="empty-comments">No comments yet!</p>
    </div>
  `,
  data: function() {
    return {
      filter: ''
    }
  },
  computed: {
    empty_comments: function(data) {
      return data.comments.length === 0
    },
    filtered_comments: function(data) {
      if (data.filter.length === 0) {
        return data.comments
      } else {
        return arrayFilter(data.comments, function(comment) {
          var pattern = new RegExp(data.filter, 'i')
          if (comment.email.match(pattern) || comment.message.match(pattern)) {
            return true
          } else {
            return false
          }
        })
      }
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
        <p v-html="html_message"></p>
      </div>
    </div>
  `,
  computed: {
    gravatar_link: function(data) {
      var gravatar_hash = md5(data.email.trim().toLowerCase())
      return `https://www.gravatar.com/avatar/${gravatar_hash}?s=50`
    },
    html_message: function(data) {
      return data.message.replace(/\n/g, '<br>')
    }
  }
})

Vue.component('spinner', {
  template: `
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  `
})

Vue.component('search-icon', {
  template: `
    <div class="search-icon">
      <?xml version="1.0" encoding="iso-8859-1"?>
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve">
        <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23
        s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
        c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17
        s-17-7.626-17-17S14.61,6,23.984,6z"/>
      </svg>

    </div>
  `
})

var app = new Vue({
  el: '#app',
  data: {
    comments: [],
    is_fetching: false
  },
  methods: {
    addComment(comment) {
      this.comments.push(comment)
    }
  },
  mounted: function() {
    this.is_fetching = true
    axios.get('/api/feed')
      .then(function (response) {
        app.is_fetching = false
        app.comments = response.data.comments
      })
  }
})
