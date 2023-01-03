/**
 * This is a very simple class that returns data asynchronously.
 *
 * This code runs on both the server and in the browser.
 *
 * You could also put the logic to detect if code is being run on
 * the server or in the browser inside the page template.
 *
 * We use 'isomorphic-fetch' as it runs both server and client side.
 */
import axios from "axios";
import { sha256 } from "js-sha256";
import Cookie from "js-cookie";
const SECRET = "FA5B8EA3AC9B9C3DFA2C7B211848E";
import * as apis from "./apiConfig";

export default class AsyncData {
  constructor(props) {
    if (typeof window === "undefined") {
      this.config = {
        headers: { Authorization: "token " + props.token },
      };
      this.admin_id = props.user_id;
    } else {
      const token = Cookie.get("token");
      this.config = {
        headers: { Authorization: "token " + token },
      };
    }
  }

  static async loginData(formData) {
    const data = await axios.post(`${process.env.api}login`, formData);
    return data;
  }

  static async getTotalUserData() {
    return await axios.get(`${process.env.api}v1/dashboard/total-users`);
  }

  static async getHCPAnalyticsData() {
    const data = await axios.get(`${process.env.api}analytics/hcp_analytics`);
    return data;
  }

  static async getMonthlyUserAnalyticsData() {
    const data = await axios.get(
      `${process.env.api}analytics/monthly_registration`
    );
    return data;
  }

  static async getModuleVisitorsAnalyticsData() {
    const data = await axios.get(
      `${process.env.api}analytics/modules_visitors`
    );
    return data;
  }

  static async getModuleCompletedAnalyticsData() {
    const data = await axios.get(
      `${process.env.api}analytics/modules_completed`
    );
    return data;
  }
  static async getWebinarRegisteredAnalyticsData(webinarId) {
    const data = await axios.get(
      `${process.env.api}analytics/webinars_registered?webinars_id=${webinarId}`
    );
    return data;
  }
  static async getWebinarCountryAnalyticsData(webinarId) {
    const data = await axios.get(
      `${process.env.api}analytics/webinars_country?webinars_id=${webinarId}`
    );
    return data;
  }
  static async getWebinarSpecialityAnalyticsData(webinarId) {
    const data = await axios.get(
      `${process.env.api}analytics/webinars_speciality?webinars_id=${webinarId}`
    );
    return data;
  }
  static async getWebinarLiveAnalyticsData(webinarId) {
    const data = await axios.get(
      `${process.env.api}analytics/webinars_live?webinars_id=${webinarId}`
    );
    return data;
  }

  static async getAllWebinarsData(webinarId) {
    const data = await axios.get(`${process.env.api}analytics/webinars`);
    return data;
  }

  static getCategoriesData() {
    const data = `${process.env.api}v1/categories`;
    return data;
  }

  async editCategoriesData(selectedKey, formdata) {
    const data = await axios.post(
      apis.EDIT_CATEGORY(selectedKey),
      formdata,
      this.config
    );
    return data;
  }
  async GrantAccessAccept(university_id,formdata) {
    const data = await axios.post(
      apis.UPDATE_University_Request(university_id),
      formdata,
      this.config
    );
    return data;
  }
  static async forgot(username) {
    const data = await axios.get(
      `${process.env.api}v1/forget-password/${username}`
    );
    return data;
  }

  static getLessonsData(admin_id) {
    const data = `${process.env.api}admin/${admin_id}/lessons`;
    return data;
  }

  static getModulesAccessRequest(admin_id, university_id) {

    const data = `${process.env.api}admin/${admin_id}/university/${university_id}/modules_access_requests`;
    return data;
  }
  static getModules(admin_id,university_id) {
    const data = `${process.env.api}admin/${admin_id}/universities/${university_id}/modules`;
    return data;
  }
  static getActiveModulesRoute(admin_id,university_id,module_id) {
    const data = `${process.env.api}admin/${admin_id}/universities/${university_id}/modules/${module_id}/activated`;
    return data;
  }
  static getDisableModulesRoute(admin_id,university_id,module_id) {
    const data = `${process.env.api}admin/${admin_id}/universities/${university_id}/modules/${module_id}/disabled`;
    return data;
  }

  static getDeleteModulesRoute(admin_id,university_id,module_id) {
    const data = `${process.env.api}admin/${admin_id}/universities/${university_id}/modules/${module_id}`;
    return data;
  }

  static getUniversity(admin_id) {
    const data = `${process.env.api}admin/${admin_id}/universities_list`;
    return data;
  }

  static getWebinarsData(admin_id) {
    const data = `${process.env.api}admin/${admin_id}/webinars`;
    return data;
  }

  static async createWebinarData(admin_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${admin_id}/webinars`,
      formData,
      config
    );
    return data;
  }
  static async pushNotification(admin_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${admin_id}/notification/push`,
      formData,
      config
    );
    return data;
  }
  static async createCategoriesData(admin_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${admin_id}/categories`,
      formData,
      config
    );
    return data;
  }
  static async createDiaBitesData(admin_id, formData, token) {
    let config = {
      headers: {
        Authorization: "token " + token,
        'Content-type': 'multipart/encrypt',
      },
    };
    const data = await axios.post(
      `${process.env.api}admin/${admin_id}/diabites`,
      formData,
      config
    );
    return data;
  }
  // createAskTheExpertModule
  static async createAskTheExpertModule(admin_id, formData, token) {
    let config = {
      headers: {
        Authorization: "token " + token,
      },
    };
    const data = await axios.post(
      `${process.env.api}admin/${admin_id}/experts`,
      formData,
      config
    );
    return data;
  }
  // createDiaClinicData
  static async createDiaClinicData(admin_id, formData, token) {
    let config = {
      headers: {
        Authorization: "token " + token,
      },
    };
    const data = await axios.post(
      `${process.env.api}admin/${admin_id}/diaclinic`,
      formData,
      config
    );
    return data;
  }



  static async createLessonData(user_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/lessons`,
      formData,
      config
    );
    return data;
  }

  static async saveCertificateData(user_id, formData, token, updateID) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/certificates${updateID ? "/" + updateID : ""}`,
      formData,
      config
    );
    return data;
  }

  static async fetchCertificate(user_id, token, id) {
    let config = {
      headers: { Authorization: "token " + token },
    };

    const data = await axios.get(
      `${apis.FETCH_CERTIFICATE(user_id, id)}`,
      config
    );

    return data;
  }

  static async getCertificateList(user_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };

    const data = await axios.get(
      `${apis.CERTIFICATES(user_id)}`,
      config
    );
    return data;
  }

  static async getDashboardData(admin_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };

    const data = await axios.get(
      `${process.env.api}admin/${admin_id}/dashboard`,
      config
    );
    return data;
  }
  static async getTheExpertDetails(user_id, expert_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/expertsById/${expert_key}`,
      config
    );
    return data;
  }

  static async getLessonDetailsData(user_id, lesson_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}/details`,
      config
    );
    return data;
  }

  static async getDiaBitesDetailsData(user_id, diabite_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/` + user_id + `/diabites/${diabite_key}`,
      config
    );
    return data;
  }
  static async getDiaClinicDetailsData(user_id, diaclinic_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/` + user_id + `/diaclinic/${diaclinic_key}`,
      config
    );
    return data;
  }
  static async getWebinarDetailsData(user_id, id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/webinars/${id}`,
      config
    );
    return data;
  }

  static async getWebinarAgendaData(user_id, lesson_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/webinars/${lesson_key}/agenda`,
      config
    );
    return data;
  }

  static async AddAgendaData(user_id, lesson_key, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/webinars/${lesson_key}/agenda`,
      formData,
      config
    );
    return data;
  }
  static async deleteAgendaData(user_id, lesson_key, agenda_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.delete(
      `${process.env.api}admin/${user_id}/webinars/${lesson_key}/agenda/${agenda_id}`,
      config
    );
    return data;
  }
  static async editAgendaData(user_id, lesson_key, agenda_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/webinars/${lesson_key}/agenda/${agenda_id}`,
      formData,
      config
    );
    return data;
  }

  static async EditWebinarBasicData(user_id, lesson_key, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/webinars/${lesson_key}`,
      formData,
      config
    );
    return data;
  }
  static async EditBasicData(user_id, lesson_key, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}`,
      formData,
      config
    );
    return data;
  }

  // EditDiaClinicBasicData
  static async EditDiaClinicBasicData(user_id, slug, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/diaclinic/${slug}`,
      formData,
      config
    );
    return data;
  }

  // EditDiaBitesBasicData
  static async EditDiaBitesBasicData(user_id, slug, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/diabites/${slug}`,
      formData,
      config
    );
    return data;
  }
  static async SendNotification(user_id, formData, token, type = 0) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      type == 0 ? `${process.env.api}admin/${user_id}/notification/send` : `${process.env.api}admin/${user_id}/notification/sendForTester`,
      formData,
      config
    );
    return data;
  }
  static async EditAskTheExpertBasicData(user_id, slug, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/experts/${slug}`,
      formData,
      config
    );
    return data;
  }
  // EditDiaBitesVideo
  static async UpdateDiaBitesDetailsData(user_id, diabite_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/` + user_id + `/diabites/${diabite_key}`,
      config
    );
    return data;
  }
  // EditDiaBitesVideo
  static async EditDiaBitesVideo(user_id, slug, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/diabiteVideoUpdate/${slug}`,
      formData,
      config
    );
    return data;
  }

  static async createOverViewData(user_id, lesson_key, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}/overview`,
      formData,
      config
    );
    return data;
  }

  async fetchUser(user_id, token, id) {
    let config = {
      headers: { Authorization: "token " + token },
    };

    const data = await axios.get(
      `${apis.FETCH_USER(user_id, id)}`,
      config
    );

    return data;
  }

  async fetchQuiz(token, id) {
    alert(token)
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token,
    },
    };

    const data = await axios.get(
      `${apis.FETCH_QUIZZES_BY_USER(id)}`,
      config
    );

    return data;
  }


  static async fetchInstructor(user_id, token, id) {
    let config = {
      headers: { Authorization: "token " + token },
    };

    const data = await axios.get(
      `${apis.FETCH_INSTRUCTOR(user_id, id)}`,
      config
    );

    return data;
  }

  static async uploadInstructorImageData(
    user_id,
    instructor_id,
    formData,
    token
  ) {
    let config = {
      headers: { Authorization: "token " + token },
    };

    const data = await axios.post(
      `${process.env.api}admin/${user_id}/instructors/${instructor_id}/upload_image`,
      formData,
      config
    );
    return data;
  }


  static async updateInstructorData(
    user_id,
    instructor_id,
    formData,
    token
  ) {
    let config = {
      headers: { Authorization: "token " + token },
    };

    const data = await axios.post(
      `${process.env.api}admin/${user_id}/instructors/${instructor_id}`,
      formData,
      config
    );
    return data;
  }

  async addVideoLesson(lesson_id, data) {
    let formData = new FormData();
    formData.append("order", data.order);
    formData.append("url", data.video);
    formData.append("duration", data.duration);
    formData.append("overview", 0);

    const res = await axios.post(
      `${apis.ADD_LESSON_VIDEO(lesson_id)}`,
      formData,
      this.config
    );
    return res;
  }

  async resetInfo(email, password, id) {
    let formdata = new FormData();
    formdata.append("user_id", id);
    formdata.append("password", password);
    formdata.append("email", email);

    formdata.append("hash", sha256(id + password + SECRET));
    try {
      const data = await axios.post(
        `${apis.FORCE_RESET_INFO(id)}`,
        formdata,
        this.config
      );
      return data;
    } catch {
      console.log("returning false");
      return false;
    }
  }
  async resetInfo_instructor(email, password, id) {
    let formdata = new FormData();
    formdata.append("instructor_id", id);
    formdata.append("password", password);
    formdata.append("email", email);

    formdata.append("hash", sha256(id + password + SECRET));
    try {
      const data = await axios.post(
        `${apis.FORCE_RESET_INFO_INSTRUCTOR(id)}`,
        formdata,
        this.config
      );
      return data;
    } catch {
      console.log("returning false");
      return false;
    }
  }

  async deleteUser(id) {
    try {
      const data = await axios.delete(
        `${apis.DELETE_USERS}/${id}`,
        this.config
      );
      return data;
    } catch {
      console.log("returning false");
      return false;
    }
  }

  static async getDetailsData(user_id, lesson_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}/simple_details`,
      config
    );
    return data;
  }

  static async createDetailsData(user_id, lesson_key, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}/details`,
      formData,
      config
    );
    return data;
  }

  static async editDetailsData(user_id, formData, detail_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/details/${detail_id}`,
      formData,
      config
    );
    return data;
  }

  static async deleteDetailsData(user_id, detail_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.delete(
      `${process.env.api}admin/${user_id}/details/${detail_id}`,
      config
    );
    return data;
  }

  static async getQuizData(user_id, lesson_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}/exam`,
      config
    );
    return data;
  }

  static async createNewInstructor(user_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/instructor`,
      formData,
      config
    );
    return data;
  }
  static async createLinkInstructor(user_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/instructor_filter`,
      formData,
      config
    );
    return data;
  }
  static async getInstructorList(user_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/instructors_list`,
      config
    );
    return data;
  }

  static async createQuestionData(user_id, lesson_key, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}/questions`,
      formData,
      config
    );
    return data;
  }

  static async refreshStatusData(user_id, lesson_key, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.get(
      `${process.env.api}admin/${user_id}/lessons/${lesson_key}/status`,
      config
    );
    return data;
  }

  static async deleteQuestionData(user_id, question_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.delete(
      `${process.env.api}admin/${user_id}/questions/${question_id}`,
      config
    );
    return data;
  }

  static async addAnswerData(user_id, question_id, formData, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/questions/${question_id}/answer`,
      formData,
      config
    );
    return data;
  }

  static async deleteAnswerData(user_id, answer_id, token) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/answer/${answer_id}`,
      config
    );
    return data;
  }

  static async setCorrectAnswerData(
    user_id,
    question_id,
    answer_id,
    formData,
    token
  ) {
    let config = {
      headers: { Authorization: "token " + token },
    };
    const data = await axios.post(
      `${process.env.api}admin/${user_id}/questions/${question_id}/answers/${answer_id}/set_correct`,
      formData,
      config
    );
    return data;
  }

  // getDiaBites

  static async getDiaBites(token, user_id) {
    let config = {
      headers: { Authorization: 'token ' + token },
    };
    let data = await axios.get(
      `${process.env.api}v1/diabites` + `?page=1&limit=100`,
      config
    )
    return data;
  }
}


