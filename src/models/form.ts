import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import router from 'umi/router';
import { message } from 'antd';
import { 
  get,
  post,
} from '@/services/builder';

export interface FormModelState {
  pageTitle:string;
  name:string;
  pageRandom:string;
  previewImage:string;
  previewVisible:boolean;
  pageLoading:boolean;
  controls: [];
  labelCol: [];
  wrapperCol: [];
}

export interface ModelType {
  namespace: string;
  state: {};
  subscriptions:{ setup: Subscription };
  effects: {
    info: Effect;
    submit: Effect;
    updateFileList: Effect;
    updateTapFileList: Effect;
    updateInputSearch: Effect;
    updateTapInputSearch: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
    updateList: Reducer<{}>;
    updateTapList: Reducer<{}>;
    previewImage: Reducer<{}>;
    pageLoading: Reducer<{}>;
    resetState: Reducer<{}>;
    updateMapCenter: Reducer<{}>;
    updateTapMapCenter: Reducer<{}>;
    updateInputSearchOption: Reducer<{}>;
    updateTapInputSearchOption: Reducer<{}>;
  };
}

const form: ModelType = {

  namespace: 'form',

  state: {
    url:'',
    pageTitle:'',
    name:'',
    pageRandom:null,
    previewImage:'',
    previewVisible:false,
    pageLoading:true,
    controls: [],
    labelCol: [],
    wrapperCol: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {

      });
    },
  },

  effects: {
    *info({ payload, callback }, { put, call, select }) {

      yield put({
        type: 'pageLoading',
        payload: { pageLoading:true},
      });

      const response = yield call(get, payload);

      if(!response) {
        return false;
      }

      if (response.status === 'success') {

        const data = { ...response.data, pageLoading:false};

        yield put({
          type: 'updateState',
          payload: data,
        });

        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      }
    },
    *submit({ payload, callback }, { put, call, select }) {
      const response = yield call(post, payload);

      if(!response) {
        return false;
      }

      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);

        // 页面跳转
        if(response.url) {
          router.push(response.url);
        }

        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      } else {
        message.error(response.msg, 3);
      }
    },
    *updateFileList({ payload, callback }, { put, call, select }) {
      yield put({
        type: 'updateList',
        payload: payload,
      });
    },
    *updateTapFileList({ payload, callback }, { put, call, select }) {
      yield put({
        type: 'updateTapList',
        payload: payload,
      });
    },
    *updateInputSearch({ payload, callback }, { put, call, select }) {
      const response = yield call(get, payload);
      const data = { data:response.data,controlName:payload.controlName};
      yield put({
        type: 'updateInputSearchOption',
        payload: data,
      });
    },
    *updateTapInputSearch({ payload, callback }, { put, call, select }) {
      const response = yield call(get, payload);
      const data = { data:response.data,controlName:payload.controlName};
      yield put({
        type: 'updateTapInputSearchOption',
        payload: data,
      });
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...action.payload,
      };
    },
    resetState(state, action) {
      let resetState = {
          pageTitle:'',
          name:'',
          pageRandom:null,
          previewImage:'',
          previewVisible:false,
          pageLoading:true,
          controls: [],
          labelCol: [],
          wrapperCol: [],
          mapCenter:[],
        }
        return {
          ...resetState,
        };
      },
    pageLoading(state, action) {
      state.pageLoading = action.payload.pageLoading;
      return {
        ...state,
      };
    },
    updateList(state, action) {
      state.controls.map((control:any,key:any) => {
        if(control.name == action.payload.controlName) {
          state.controls[key]['value'] = action.payload.fileList;
        }
      })
      state.pageRandom = Math.random();
      return {
        ...state,
      };
    },
    updateTapList(state, action) {
      state.controls.tabPanes.map((tabPane:any,key:any) => {
        tabPane.controls.map((control:any,key1:any) => {

          if(control.name == action.payload.controlName) {
            state.controls.tabPanes[key].controls[key1]['value'] = action.payload.fileList;
          }

        })
      })
      state.pageRandom = Math.random();
      return {
        ...state,
      };
    },
    updateMapCenter(state, action) {
      state.controls.map((control:any,key:any) => {
        if(control.name == action.payload.controlName) {
          state.controls[key]['value']['longitude'] = action.payload.longitude;
          state.controls[key]['value']['latitude'] = action.payload.latitude;
        }
      })

      state.pageRandom = Math.random();

      return {
        ...state,
      };
    },
    updateTapMapCenter(state, action) {
      state.controls.tabPanes.map((tabPane:any,key:any) => {
        tabPane.controls.map((control:any,key1:any) => {

          if(control.name == action.payload.controlName) {
            state.controls.tabPanes[key].controls[key1]['value']['longitude'] = action.payload.longitude;
            state.controls.tabPanes[key].controls[key1]['value']['latitude'] = action.payload.latitude;
          }

        })
      })
      state.pageRandom = Math.random();
      return {
        ...state,
      };
    },
    previewImage(state, action) {
      state.previewVisible = action.payload.previewVisible;
      state.previewImage = action.payload.previewImage;
      return {
        ...state,
      };
    },
    updateInputSearchOption(state, action) {
      state.controls.map((control:any,key:any) => {
        if(control.name == action.payload.controlName) {
          state.controls[key]['options']['longitude'] = action.payload.data;
        }
      })
      state.pageRandom = Math.random();
      return {
        ...state,
      };
    },
    updateTapInputSearchOption(state, action) {
      state.controls.tabPanes.map((tabPane:any,key:any) => {
        tabPane.controls.map((control:any,key1:any) => {
          if(control.name == action.payload.controlName) {
            state.controls.tabPanes[key].controls[key1]['options'] = action.payload.data;
          }
        })
      })
      state.pageRandom = Math.random();
      return {
        ...state,
      };
    },
  },
};

export default form;
