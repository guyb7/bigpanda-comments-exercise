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
      <input v-model="filter" type="text" placeholder="Filter">
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
      return data.message.replace("\n", '<br>')
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
