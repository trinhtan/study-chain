<template>
  <div class="container-fluid" v-loading.fullscreen.lock="fullscreenLoading">
    <h1 class="bannerTitle_1wzmt7u">{{ classInfo.ClassCode }}</h1>
    <b-breadcrumb>
      <b-breadcrumb-item to="/academy"> <i class="blue fas fa-home"></i>Home </b-breadcrumb-item>
      <b-breadcrumb-item to="/academy/subjects"> Subjects</b-breadcrumb-item>
      <b-breadcrumb-item :to="`/academy/subjects/${this.$route.params.id}`">{{
        subjectCurent ? subjectCurent.SubjectName : ''
      }}</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ classInfo ? classInfo.ClassCode : '' }}</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="mb-5">
      <div>
        <div class="card-body">
          <h2 class="h4 mb-2 text-gray-800">About this class</h2>
          <div class="row">
            <div class="col">
              <p>
                Time: <b>{{ classInfo.Time }}</b>
              </p>
              <p>
                Start:
                <b>{{ convertDate(classInfo.StartDate) }} </b>
              </p>
              <p>
                End:
                <b> {{ convertDate(classInfo.EndDate) }}</b>
              </p>
              <p>
                Repeat:
                <b
                  >{{
                    classInfo.Repeat +
                      (classInfo.StartDate ? ' on ' + getDay(classInfo.StartDate) : '')
                  }}
                </b>
              </p>
            </div>
            <div class="col">
              <p>
                Room:
                <b> {{ classInfo.Room }}</b>
              </p>
              <p>
                Capacity:
                <b> {{ classInfo.Capacity }}</b>
              </p>
              <p>
                Status:
                <b-badge :variant="classInfo.Status === 'Open' ? 'success' : 'primary'">{{
                  classInfo.Status
                }}</b-badge>
              </p>
              <p>
                Teacher:
                <el-select
                  v-if="classInfo.TeacherUsername === ''"
                  v-model="teacherUsername"
                  placeholder="Teacher"
                  size="mini"
                >
                  <el-option
                    :label="teacher.Fullname"
                    :value="teacher.Username"
                    v-for="(teacher, index) in listTeachers"
                    :key="index"
                  ></el-option>
                </el-select>

                <el-button
                  class="ml-3"
                  v-if="teacherUsername !== ''"
                  type="success"
                  icon="el-icon-check"
                  size="mini"
                  circle
                  @click="assignTeacherToClass()"
                ></el-button>
                <el-button
                  v-if="teacherUsername !== ''"
                  type="danger"
                  icon="el-icon-close"
                  size="mini"
                  circle
                  @click="cancelAssign()"
                ></el-button>

                <router-link
                  v-if="classInfo.TeacherUsername !== ''"
                  :to="`/academy/teachers/${classInfo.TeacherUsername}`"
                >
                  {{ classInfo.TeacherUsername }}
                </router-link>
              </p>
              <p>
                Subject:
                <router-link :to="`/academy/subjects/${classInfo.SubjectID}`">
                  {{ classInfo.SubjectName }}
                </router-link>
              </p>
            </div>
          </div>
          <el-button
            v-if="classInfo.Status === 'Open'"
            type="primary"
            round
            size="mini"
            @click="startClass()"
            >Start</el-button
          >
        </div>
      </div>
    </div>
    <table-admin
      :title="`Student List`"
      :listAll="listStudents ? listStudents : []"
      :loadingData="loadingData"
      :nameFunctionDetail="`showInfoStudent`"
      :listProperties="[
        { prop: 'Fullname', label: 'FullName' },
        { prop: 'Info.Birthday', label: 'Birthday' },
        { prop: 'Info.Address', label: 'Address' }
      ]"
      @showInfoStudent="showInfoStudent($event)"
    >
    </table-admin>
    <el-dialog title="Information Student" :visible.sync="showInfo" class="modal-with-create">
      <el-form :model="infoStudent" ref="infoStudent">
        <div>
          <img v-if="infoStudent.Avatar" :src="infoStudent.Avatar" :alt="Avatar" class="avatar" />
          <img v-else src="@/assets/img/avatar-default.png" class="avatar" />
        </div>
        <div class="form-group">
          <label for="colFormLabelLg" class="col-sm-12 col-form-label col-form-label-md"
            >Full name</label
          >
          <div class="col-sm-12">
            <h4 class="pl-3">{{ infoStudent.Fullname }}</h4>
          </div>
        </div>
        <div class="form-group">
          <label for="colFormLabelLg" class="col-sm-12 col-form-label col-form-label-md"
            >Birthday</label
          >
          <div class="col-sm-12">
            <h4 class="pl-3">{{ infoStudent.Birthday }}</h4>
          </div>
        </div>
        <div class="form-group">
          <label for="colFormLabelLg" class="col-sm-12 col-form-label col-form-label-md"
            >Phone Number</label
          >
          <div class="col-sm-12">
            <h4 class="pl-3">{{ infoStudent.PhoneNumber }}</h4>
          </div>
        </div>

        <div class="form-group">
          <label for="colFormLabelLg" class="col-sm-12 col-form-label col-form-label-md"
            >Email</label
          >
          <div class="col-sm-12">
            <h4 class="pl-3">{{ infoStudent.Email }}</h4>
          </div>
        </div>
        <div class="form-group">
          <label for="colFormLabelLg" class="col-sm-12 col-form-label col-form-label-md"
            >Address</label
          >
          <div class="col-sm-12">
            <h4 class="pl-3">{{ infoStudent.Address }}</h4>
          </div>
        </div>
        <div class="form-group">
          <label for="colFormLabelLg" class="col-sm-12 col-form-label col-form-label-md"
            >Gender</label
          >
          <div class="col-sm-12">
            <h4 class="pl-3">{{ infoStudent.Sex === '0' ? 'Male' : 'Female' }}</h4>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import TableAdmin from '@/components/admin-academy/TableAdmin';
import { Button, Select, Option, Dialog, Form, FormItem, Message, MessageBox } from 'element-ui';

export default {
  data() {
    return {
      daysInWeek: [
        { item: 'Sun', value: 'Sunday' },
        { item: 'Mon', value: 'Monday' },
        { item: 'Tue', value: 'Tuesday' },
        { item: 'Wed', value: 'Wednesday' },
        { item: 'Thu', value: 'Thursday' },
        { item: 'Fri', value: 'Friday' },
        { item: 'Sat', value: 'Saturday' }
      ],
      startDate: '',
      endDate: '',
      loadingData: false,
      fullscreenLoading: false,
      showInfo: false,
      infoStudent: {
        Fullname: '',
        PhoneNumber: '',
        Email: '',
        Address: '',
        Sex: '',
        Birthday: '',
        Avatar: '',
        Country: ''
      },
      teacherUsername: ''
    };
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    TableAdmin,
    'el-button': Button,
    'el-select': Select,
    'el-option': Option,
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem
  },
  methods: {
    ...mapActions('adminAcademy', [
      'getClass',
      'closeClass',
      'getStudentsOfClass',
      'getAllTeachers',
      'changeTeacherOfClass',
      'getSubject'
    ]),
    async assignTeacherToClass() {
      this.fullscreenLoading = true;
      let response = await this.changeTeacherOfClass({
        username: this.teacherUsername,
        classId: this.$route.params.classId
      });

      if (!response) {
        this.teacherUsername = '';
        await this.getClass(this.$route.params.classId);
        this.fullscreenLoading = false;
        return Message.error('Assign teacher to class has failed!');
      }

      this.teacherUsername = '';
      Message.success('Assign teacher to class successfully!');
      await this.getClass(this.$route.params.classId);
      this.fullscreenLoading = false;
    },
    cancelAssign() {
      this.teacherUsername = '';
      Message.info('Canceled');
    },
    startClass() {
      MessageBox.confirm(`Are you sure to start this class?`, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      })
        .then(async () => {
          this.fullscreenLoading = true;

          let response = await this.closeClass({ classId: this.$route.params.classId });

          if (!response) {
            await this.getClass(this.$route.params.classId);
            this.fullscreenLoading = false;
            return Message.error('Start class has failed');
          }

          this.status = false;
          Message.success('This class has been started!');

          await this.getClass(this.$route.params.classId);
          this.fullscreenLoading = false;
        })
        .catch(() => {
          Message.info('Canceled');
        });
    },
    showInfoStudent(row) {
      this.showInfo = true;

      this.infoStudent.Fullname = row.Fullname;
      this.infoStudent.PhoneNumber = row.Info.PhoneNumber;
      this.infoStudent.Email = row.Info.Email;
      this.infoStudent.Address = row.Info.Address;
      this.infoStudent.Sex = row.Info.Sex;
      this.infoStudent.Birthday = row.Info.Birthday;
      this.infoStudent.Avatar = row.Info.Avatar;
      this.infoStudent.Country = row.Info.Country;
    },
    resetForm() {
      this.showInfo = false;
    },
    convertDate(timestamp) {
      let date = new Date(parseInt(timestamp));
      return date.toDateString();
    },
    getDay(timestamp) {
      let date = new Date(parseInt(timestamp));
      let day = this.daysInWeek[date.getDay()].value;

      return day.toString();
    }
  },
  computed: {
    ...mapState('adminAcademy', ['classInfo', 'listStudents', 'listTeachers', 'subjectCurent'])
  },
  async created() {
    await this.getSubject(this.$route.params.id);
    let classObj = await this.getClass(this.$route.params.classId);
    let student = await this.getStudentsOfClass(this.$route.params.classId);
    await this.getAllTeachers();

    if (classObj.success && student) {
      this.classInfo = classObj.class;
    }
    this.loadingData = false;
  }
};
</script>
<style scoped>
.bannerTitle_1wzmt7u {
  font-family: 'OpenSans-Bold', Arial, sans-serif;
  font-size: 34px;
  line-height: 46px;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 24px;
  color: blue;
}
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  align-self: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.el-select {
  width: 100px;
}
</style>
