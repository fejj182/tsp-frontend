<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon text dark v-bind="attrs" v-on="on">
          <v-icon>mdi-forum</v-icon>
          <span class="sr-only">Contact Us</span>
        </v-btn>
      </template>
      <v-card>
        <v-form ref="form" @submit.prevent="onSubmit">
          <v-card-title class="mb-4">
            Tell us what you're thinking...
          </v-card-title>
          <v-card-subtitle class="pb-0">
            <span class="mb-2">Feedback is everything to us.</span>
          </v-card-subtitle>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="name" label="Name"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="rules.emailRules"
                    label="Email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="feedback"
                    :rules="rules.feedbackRequired"
                    label="Thoughts"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="primary" type="submit">
              Send
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    valid: true,
    name: "",
    email: "",
    feedback: "",
    rules: {}
  }),
  methods: {
    onSubmit() {
      this.rules = {
        emailRules: [v => !v || /.+@.+\..+/.test(v) || "E-mail must be valid"],
        feedbackRequired: [v => !!v || "Please tell us something :)"]
      };
      this.$nextTick(() => {
        const valid = this.$refs.form.validate();
        if (valid) {
          this.dialog = false;
          this.$refs.form.reset();
          this.rules = {};
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
