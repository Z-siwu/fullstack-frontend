import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';

import {
  Card,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Tabs,
  Switch,
  Icon,
  Tag,
  Form,
  Select,
  Input,
  Button,
  Checkbox,
  Radio,
  Upload,
  message,
  Modal,
  Steps,
  Cascader,
  TreeSelect
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { Step } = Steps;
const { TreeNode } = TreeSelect;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class CreatePage extends PureComponent {

  state = {
    msg: '',
    url: '',
    data: {
      goods_types: [],
    },
    status: '',
    loading: false,
    selected:'0'
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {

    // 获得url参数
    const params = this.props.location.query;

    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/create',
      },
      callback: (res) => {
        if (res) {
          if(params.id) {
            this.setState({ data: res.data,selected:params.id });
          } else {
            this.setState({ data: res.data,selected:'0' });
          }
        }
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: {
            actionUrl: 'admin/goods/store',
            ...values,
          },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 12,
        offset: 2
      },
    };

    let state = {
      loading: false,
    };

    const options = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      }
    ];

    // 单图片上传模式
    let uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const handleEditorUpload = (param) => {
      const serverURL = '/api/admin/picture/upload';
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
  
      const successFn = (response) => {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
  
        const responseObj = JSON.parse(xhr.responseText);
  
        if (responseObj.status === 'success') {
          param.success({
            url: responseObj.data.url,
            meta: {
              id: responseObj.data.id,
              title: responseObj.data.title,
              alt: responseObj.data.title,
              loop: true, // 指定音视频是否循环播放
              autoPlay: true, // 指定音视频是否自动播放
              controls: true, // 指定音视频是否显示控制栏
              poster: responseObj.data.url, // 指定视频播放器的封面
            },
          });
        } else {
          // 上传发生错误时调用param.error
          param.error({
            msg: responseObj.msg,
          });
        }
      };
  
      const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        param.progress((event.loaded / event.total) * 100);
      };
  
      const errorFn = (response) => {
        // 上传发生错误时调用param.error
        param.error({
          msg: 'unable to upload.',
        });
      };
  
      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);
  
      fd.append('file', param.file);
      xhr.open('POST', serverURL, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage['token']);
      xhr.send(fd);
    };

    return (
      <PageHeaderWrapper title={false}>
        <div style={{background:'#fff',padding:'20px'}}>
          <Steps current={0} style={{width:'900px',margin:'30px auto'}}>
            <Step title="填写商品详情" />
            <Step title="上传商品图片" />
            <Step title="商品发布成功" />
          </Steps>
          <div className="steps-content" style={{width:'800px',margin:'40px auto'}}>
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
              <Form.Item {...formItemLayout} label="商品分类">
                {getFieldDecorator('goods_category_id',{
                    initialValue: ''
                  })(
                  <Cascader style={{ width: 400 }} options={options} placeholder="请选择商品分类" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品类别">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Radio.Group>
                    <Radio value={1}>实物商品（物流发货）</Radio>
                    <Radio value={2}>电子卡券（无需物流）</Radio>
                    <Radio value={3}>服务商品（无需物流）</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="扩展分类">
                {getFieldDecorator('name',{
                    initialValue: undefined
                  })(
                  <TreeSelect
                    showSearch
                    style={{ width: 400 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择扩展分类"
                    allowClear
                    multiple
                    treeDefaultExpandAll
                  >
                    <TreeNode value="parent 1" title="parent 1" key="0-1">
                      <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                        <TreeNode value="leaf1" title="my leaf" key="random" />
                        <TreeNode value="leaf2" title="your leaf" key="random1" />
                      </TreeNode>
                      <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                        <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
                      </TreeNode>
                    </TreeNode>
                  </TreeSelect>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品名称">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入规格名称" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="关键词">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入关键词" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品买点">
                {getFieldDecorator('description',{
                    initialValue: ''
                  })(
                  <TextArea
                    style={{ width: 400 }}
                    placeholder="请输入商品买点"
                    autosize={{ minRows: 3, maxRows: 5 }}
                  />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="计价方式">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Radio.Group>
                    <Radio value={1}>计件</Radio>
                    <Radio value={2}>计重</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品单位">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Select style={{ width: 200 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品品牌">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Select style={{ width: 200 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品属性">

              </Form.Item>
              <Form.Item {...formItemLayout} label="商品规格">

              </Form.Item>
              <Form.Item {...formItemLayout} label="最新起订量">
                {getFieldDecorator('sort',{
                    initialValue: 0
                  })(
                  <InputNumber style={{ width: 200 }} placeholder="最新起订量" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="店铺价">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 200 }} placeholder="请输入店铺价" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="市场价">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 200 }} placeholder="请输入市场价" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="成本价">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 200 }} placeholder="请输入成本价" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品库存">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 200 }} placeholder="请输入商品库存" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="库存警告数量">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 200 }} placeholder="请输入库存警告数量" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品货号">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入商品货号" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品条形码">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入商品条形码" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品库位码">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入商品库位码" />,
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="商品主图"
              >
                <Upload
                  name={'file'}
                  listType={"picture-card"}
                  showUploadList={false}
                  action={'/api/admin/picture/upload'}
                  headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                  beforeUpload = {(file) => {
                    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                      message.error('请上传jpg或png格式的图片!');
                      return false;
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('图片大小不可超过2MB!');
                      return false;
                    }
                    return true;
                  }}
                  onChange = {(info) => {
                    if (info.file.status === 'done') {
                      // Get this url from response in real world.
                      if (info.file.response.status === 'success') {
                        let fileList = [];
                        if (info.file.response) {
                          info.file.url = info.file.response.data.url;
                          info.file.uid = info.file.response.data.id;
                          info.file.id = info.file.response.data.id;
                        }
                        fileList[0] = info.file;
                        this.setState({ coverId: fileList });
                      } else {
                        message.error(info.file.response.msg);
                      }
                    }
                  }}
                >
                  {this.state.coverId ? (
                    <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                  ) : (uploadButton)}
                </Upload>
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="主图视频"
              >
                <Upload
                  name={'file'}
                  listType={"picture-card"}
                  showUploadList={false}
                  action={'/api/admin/picture/upload'}
                  headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                  beforeUpload = {(file) => {
                    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                      message.error('请上传jpg或png格式的图片!');
                      return false;
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('图片大小不可超过2MB!');
                      return false;
                    }
                    return true;
                  }}
                  onChange = {(info) => {
                    if (info.file.status === 'done') {
                      // Get this url from response in real world.
                      if (info.file.response.status === 'success') {
                        let fileList = [];
                        if (info.file.response) {
                          info.file.url = info.file.response.data.url;
                          info.file.uid = info.file.response.data.id;
                          info.file.id = info.file.response.data.id;
                        }
                        fileList[0] = info.file;
                        this.setState({ coverId: fileList });
                      } else {
                        message.error(info.file.response.msg);
                      }
                    }
                  }}
                >
                  {this.state.coverId ? (
                    <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                  ) : (uploadButton)}
                </Upload>
              </Form.Item>
              <Form.Item {...formItemLayout} label="商品内容">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="电脑端" key="1">
                    <div style={{border: '1px solid #ccc;'}}>
                      {getFieldDecorator('pc_content',{
                        initialValue: BraftEditor.createEditorState(),
                      })(
                        <BraftEditor
                          contentStyle={{'height' : 400, 'boxShadow' : 'inset 0 1px 3px rgba(0,0,0,.1)'}}
                          media={{ uploadFn: handleEditorUpload }}
                        />
                      )}
                    </div>
                  </TabPane>
                  <TabPane tab="手机端" key="2">
                    <div style={{border: '1px solid #ccc;'}}>
                      {getFieldDecorator('mobile_content',{
                        initialValue: BraftEditor.createEditorState(),
                      })(
                        <BraftEditor
                          contentStyle={{'height' : 400, 'boxShadow' : 'inset 0 1px 3px rgba(0,0,0,.1)'}}
                          media={{ uploadFn: handleEditorUpload }}
                        />
                      )}
                    </div>
                  </TabPane>
                </Tabs>
              </Form.Item>
              <Form.Item {...formItemLayout} label="排序">
                {getFieldDecorator('sort',{
                    initialValue: 0
                  })(
                  <InputNumber style={{ width: 200 }} placeholder="排序" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status',{
                    initialValue: true,
                    valuePropName: 'checked'
                  })(
                  <Switch checkedChildren="正常" unCheckedChildren="禁用" />,
                )}
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
                <Button type="primary" htmlType="submit">
                  下一步
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CreatePage;