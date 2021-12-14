import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { GraphQLClient, request } from 'graphql-request';

const UPLOADFILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;
const endpoint = 'http://localhost:4001/graphql';
const graphQLClient = new GraphQLClient(endpoint, {
  credentials: 'include',
  mode: 'cors',
});

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor() {}
  uploadFile(file: any) {
    return request(endpoint, UPLOADFILE, {
      file: file,
    });

  }
}
