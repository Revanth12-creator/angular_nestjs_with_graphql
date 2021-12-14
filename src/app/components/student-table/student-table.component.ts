import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Student } from 'src/app/Student';
import {StudentService} from '../../services/student.service';
import * as SC from 'socketcluster-client';
import { NotificationService } from '@progress/kendo-angular-notification';

let socket = SC.create({
  hostname: 'localhost',
  port: 8002,
});

const GET_STUDENTS = gql`
  query {
    findAllStudents {
      id
      name
      email
      dateofbirth
      age
    }
  }
`;

const CREATE_STUDENT = gql`
  mutation ($names: String!, $email: String!, $dateofbirth: DateTime!) {
    createStudent(
      createStudentInput: {
        name: $names
        email: $email
        dateofbirth: $dateofbirth
      }
    ) {
      id
      name
      email
      dateofbirth
      age
    }
  }
`;
const DELETE = gql`
  mutation ($studentId: String!) {
    removeStudent(id: $studentId) {
      __typename
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation (
    $studentId: String!
    $names: String!
    $email: String!
    $dateofbirth: DateTime!
  ) {
    updateStudent(
      updateStudentInput: {
        id: $studentId
        name: $names
        email: $email
        dateofbirth: $dateofbirth
      }
    ) {
      __typename
    }
  }
`;
@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css'],
})
export class StudentTableComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;

  data: any;
  editedRowIndex: number = 0;
  editRow: any;
  id!: string;
  closeRow: any;
  students: Student[] = [];
  public uploadRemoveUrl = 'removeUrl';
  public uploadSaveUrl = 'saveUrl';
  dialogOpened: boolean = false;
  dialogOpen: boolean = false;
  update: boolean = false;
  public gridView!: GridDataResult;
  form: FormGroup = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    dob: new FormControl(),
  });

    constructor(private apollo: Apollo, private studentService: StudentService,
      private notificationService: NotificationService) {
    this.loadItems();
  }

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: GET_STUDENTS,
      })
      .valueChanges.subscribe((result: any) => {
        this.students = result.data.findAllStudents;
        console.log('students', this.students);
      });
  }

  openDialog() {
    this.dialogOpened = true;
  }

  closeDialog() {
    this.dialogOpened = false;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();

  }

  private loadItems(): void {
    this.gridView = {
      data: this.students.slice(this.skip, this.skip + this.pageSize),
      total: this.students.length,
    };
  }

  addStudent() {
    this.apollo
      .mutate({
        mutation: CREATE_STUDENT,
        variables: {
          names: this.form.value.name,
          email: this.form.value.email,
          dateofbirth: this.form.value.dob,
        },
        refetchQueries: [{ query: GET_STUDENTS }],
      })
      .subscribe((result: any) => {
        console.log('create', result.data.createStudent);
        this.dialogOpened = false;
      });
  }

  clearForm() {
    this.form.reset();
  }
  deleteStudent(id: any) {
    this.apollo
      .mutate({
        mutation: DELETE,
        variables: {
          studentId: id,
        },
      })
      .subscribe(() => {
        this.students = this.students.filter((data: any) => data.id !== id);
      });
    console.log(id);
  }

  editHandler(data: any) {
    console.log('data', data);
    this.update = true;
    this.editRow = new FormGroup({
      name: new FormControl(data.dataItem.name),
      email: new FormControl(data.dataItem.email),
      dob: new FormControl(data.dataItem.dateofbirth),
      // age: new FormControl(
      //   data.dataItem.age,
      //   Validators.compose([Validators.pattern('yyyy/MM/dd')])
      // ),
    });
    this.editedRowIndex = data.rowIndex;
    data.sender.editRow(data.rowIndex, this.editRow);
    console.log(this.editRow);
  }

  saveHandler(data: any) {
    console.log(data);
    this.apollo
      .mutate({
        mutation: UPDATE_STUDENT,
        variables: {
          studentId: data.dataItem.id,
          names: data.formGroup.value.name,
          email: data.formGroup.value.email,
          dateofbirth: data.formGroup.value.dob,
        },
        refetchQueries: [{ query: GET_STUDENTS }],
      })
      .subscribe((result: any) => {
        data.sender.closeRow(data.rowIndex, this.closeRow);
        console.log('update', result);
        this.update = false;
      });
  }
  async fetchData() {
    const query = await this.apollo.watchQuery<any>({
      query: gql`
        query {
          findAllStudents {
            id
            name
            age
            email
            dateofbirth
          }
        }
      `,
      fetchPolicy: 'network-only',
    });

    await query.valueChanges.subscribe(({ data }) => {
      this.students = data.findAllStudents;
      this.loadItems();
    });
  }

  public onUpload(event: any) {
    event.preventDefault();
    const file = event.files[0].rawFile;
    console.log('f____', file);

    const query = this.studentService.uploadFile(file);

    query.then(() => {
      setTimeout(()=> {
      this.fetchData();
      },1000)
    }).catch(err=> {
      console.log(err)
    });
    (async()=> {
      let channel=socket.subscribe('student');
      for await(let data of channel){
        if(data){
          this.notificationService.show({
            content:'SuccessFully Upladed Entry',
            hideAfter:3000,
            position:{ horizontal: 'right', vertical: 'top', },
            animation:{ type: 'fade', duration: 900 },
            type: { style: 'success', icon: true },
          })
        }
      }
    })();

    (async () => {
      let channel = socket.subscribe('studentF');
      for await (let data of channel) {
        if (data) {
          this.notificationService.show({
            content: `Entry Uploaded Rejected`,
            hideAfter: 3000,
            position: { horizontal: 'right', vertical: 'top' },
            animation: { type: 'fade', duration: 900 },
            type: { style: 'error', icon: true },
          });
        }
      }
    })();
  }
  
}
