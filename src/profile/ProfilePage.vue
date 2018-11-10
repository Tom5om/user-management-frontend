<template>
    <div>
        <h1>Profile for {{account.user.firstName}} {{account.user.lastName}}</h1>

        <div class="profile-page">
            <form @submit.prevent="handleSubmit" novalidate="novalidate">
                <fieldset class="profile-info">
                    <div class="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" v-model="user.firstName" v-validate="{ required: true, min: 3 }" name="firstName" class="form-control" :class="{ 'is-invalid': submitted && errors.has('firstName') }" />
                        <div v-if="submitted && errors.has('firstName')" class="invalid-feedback">{{ errors.first('firstName') }}</div>
                    </div>
                    <div class="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" v-model="user.lastName" v-validate="{ required: true, min: 3 }" name="lastName" class="form-control" :class="{ 'is-invalid': submitted && errors.has('lastName') }" />
                        <div v-if="submitted && errors.has('lastName')" class="invalid-feedback">{{ errors.first('lastName') }}</div>
                    </div>
                    <div class="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" v-model="user.email" v-validate="{ required: true, min: 3 }" name="email" class="form-control" :class="{ 'is-invalid': submitted && errors.has('email') }" />
                        <div v-if="submitted && errors.has('email')" class="invalid-feedback">{{ errors.first('email') }}</div>
                    </div>
                    <div class="form-group">
                        <label htmlFor="address">Address</label>
                        <input type="text" v-model="user.address" name="address" class="form-control" :class="{ 'is-invalid': submitted && errors.has('address') }" />
                        <div v-if="submitted && errors.has('address')" class="invalid-feedback">{{ errors.first('address') }}</div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" :disabled="status.submitting">Submit</button>
                        <img v-show="status.submitting" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    </div>
                    <p class="success" v-if="update.updated">Successfully updated profile</p>
                </fieldset>
            </form>
            <form enctype="multipart/form-data" novalidate v-if="upload || upload.uploading">
                <fieldset class="photo">
                    <div v-if="upload.file || account.user.image" class="profile-image">
                        <img v-if="upload.file" :src="upload.file.url" class="img-responsive img-thumbnail">
                        <img v-else-if="getImage" :src="getImage" class="img-responsive img-thumbnail">
                    </div>


                    <h3>Upload profile photo</h3>
                    <div class="dropbox">
                        <input type="file" :name="uploadFieldName" :disabled="upload.uploading" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                               accept="image/*" class="input-file">
                        <p v-if="">
                            Drag your file here to begin<br> or click to browse
                        </p>
                        <p v-if="upload.uploading">
                            Uploading...
                        </p>
                    </div>
                    <!--FAILED-->
                    <div v-if="upload.error">
                        <h2>Upload failed.</h2>
                        <pre>{{ upload.error }}</pre>
                    </div>
                    <span v-if="account.error" class="text-danger">ERROR: {{account.error}}</span>
                </fieldset>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { userService } from "../_services";

export default {
  data() {
    return {
      submitted: false,
      uploadFieldName: "photo"
    };
  },
  computed: {
    ...mapState("account", ["status"]),
    getImage(state) {
      return userService.getPhoto(state.account.user);
    },

    ...mapState({
      account: state => state.account,
      user: state => state.account.user,
      upload: state => state.profile.upload,
      update: state => state.profile.update
    })
  },
  methods: {
    saveFile(formData) {
      this.uploadFile(formData);
    },
    handleSubmit(e) {
      this.submitted = true;
      this.$validator.validate().then(valid => {
        if (valid) {
          let user = {
            id: this.account.user.id,
            firstName: this.account.user.firstName,
            lastName: this.account.user.lastName,
            email: this.account.user.email,
            address: this.account.user.address
          };
          //only send relevant fields;
          this.submitProfile(user);
        }
      });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });

      // save it
      this.saveFile(formData);
    },
    ...mapActions("profile", {
      uploadFile: "uploadFile",
      submitProfile: "submitProfile"
    })
  }
};
</script>


<style lang="scss" scoped>
.profile-page {
  display: flex;
}
.profile-info {
  padding: 20px;
}
.photo {
  img {
    max-width: 300px;
  }
  padding: 20px;
}
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
