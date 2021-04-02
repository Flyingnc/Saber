<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               :row-style="rowStyle"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menu" slot-scope="scope">
        <el-button type="primary"
                   size="small"
                   @click="handleApply(scope.row,loading)">确认
        </el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.feedoutgoing_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove,updatestatus} from "@/api/wens/feed/feedoutgoing";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          // addBtn: false,
          delBtn: false,
          editBtn: true,
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 0,
          tip: false,
          border: true,
          index: false,
          viewBtn: false,
          selection: true,
          menuWidth: 100,
          column: [
            {
              label: "id",
              prop: "id",
              addDisplay:false,
              hide: true          
            },
            {
              label: "需求单位",
              prop: "org",
              search: true,
              rules: [{
                required: true,
                message: "请输入需求单位",
                trigger: "blur"
              }]
            },
            {
              label: "车牌号",
              prop: "carPlate",
              search: true,
              rules: [{
                required: true,
                message: "请输入车牌号",
                trigger: "blur"
              }]
            },
            {
              label: "车仓号",
              prop: "carBarn",
              rules: [{
                required: true,
                message: "请输入车仓号",
                trigger: "blur"
              }]
            },
            {
              label: "发料口",
              prop: "spout",
              rules: [{
                required: false,
                message: "请输入发料口",
                trigger: "blur"
              }]
            },
            {
              label: "养户姓名",
              prop: "userName",
              rules: [{
                required: true,
                message: "请输入养户姓名",
                trigger: "blur"
              }]
            },
            {
              label: "311",
              prop: "feed311",
              rules: [{
                required: false,
                message: "请输入311",
                trigger: "blur"
              }]
            },
            {
              label: "312前",
              prop: "feed312bf",
              rules: [{
                required: false,
                message: "请输入312前",
                trigger: "blur"
              }]
            },
            {
              label: "312中",
              prop: "feed313md",
              rules: [{
                required: false,
                message: "请输入312中",
                trigger: "blur"
              }]
            },
            {
              label: "312后",
              prop: "feed312at",
              rules: [{
                required: false,
                message: "请输入312后",
                trigger: "blur"
              }]
            },
            {
              label: "314大",
              prop: "feed314bg",
              rules: [{
                required: false,
                message: "请输入314大",
                trigger: "blur"
              }]
            },
            {
              label: "315大",
              prop: "feed315bg",
              rules: [{
                required: false,
                message: "请输入315大",
                trigger: "blur"
              }]
            },
            {
              label: "313后备",
              prop: "feed313rs",
              rules: [{
                required: false,
                message: "请输入313后备",
                trigger: "blur"
              }]
            },
            {
              label: "332怀",
              prop: "feed332pg",
              rules: [{
                required: false,
                message: "请输入332怀",
                trigger: "blur"
              }]
            },
            {
              label: "333哺乳",
              prop: "feed333ns",
              rules: [{
                required: false,
                message: "请输入333哺乳",
                trigger: "blur"
              }]
            },
            {
              label: "335种公",
              prop: "feed335sm",
              rules: [{
                required: false,
                message: "请输入335种公",
                trigger: "blur"
              }]
            },
            {
              label: "出料状态",
              prop: "status",
              type:'select',
              dicData:[
                {
                  label:'未出料',
                  value:0
                },{
                  label:'已出料',
                  value:1
                }
              ],
              rules: [{
                required: true,
                message: "请输入出料状态（0-未出料，1-已出料）",
                trigger: "blur"
              }]
            },
            {
              label: "领料时间",
              prop: "outtime",
              type: "date",
              format:'yyyy-MM-dd',
              valueFormat:'yyyy-MM-dd',
              rules: [{
                required: true,
                message: "请输入领料时间",
                trigger: "blur"
              }]
            },
            {
              label: "开始时间",
              prop: "starttime",
              showColumn:false,
              search: true,
              type: "date",
              format:'yyyy-MM-dd',
              addDisplay:false,
              valueFormat:'yyyy-MM-dd',
              mock:{
                    type:'datetime',
                    format:'yyyy-MM-dd'
                  }
            },
            {
              label: "结束时间",
              prop: "endtime",
              search: true,
              showColumn:false,
              type: "date",
              format:'yyyy-MM-dd',
              addDisplay:false,
              valueFormat:'yyyy-MM-dd',
              mock:{
                    type:'datetime',
                    format:'yyyy-MM-dd'
                  }
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.feedoutgoing_add, false),
          viewBtn: this.vaildData(this.permission.feedoutgoing_view, false),
          delBtn: this.vaildData(this.permission.feedoutgoing_delete, false),
          editBtn: this.vaildData(this.permission.feedoutgoing_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
       rowStyle({row}){
        if(row.status===1){
          return {
              backgroundColor:'#00FFFF',
              color:'#000000'
          }
        }
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      handleApply(row,loading) {
        console.info(row.id);
        updatestatus(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });

      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
