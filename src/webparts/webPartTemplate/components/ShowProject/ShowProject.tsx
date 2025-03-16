import * as React from 'react';

//const ShowProject: React.FunctionComponent<MyType> = (props: MyType) :JSX.Element => {
//const ShowProject: React.FunctionComponent<{ id: number; text: string }> = (props: { id: number; text: string }) :JSX.Element => {
//const ShowProject: React.FunctionComponent<{ id: number; text: string }> = (props: { id: number; text: string }) :JSX.Element => {
//const ShowProject: React.FC<{ id: number; text: string }> = (props: { id: number; text: string }) :JSX.Element => {
//const ShowProject: React.FC<{ id: number; text: string }> = (props) => {
//const ShowProject: React.FC<{ id: number; text: string }> = ({ value, onChangeValue }) => {
// React.FC da usare se si vogliono renderizzare i children {props.children} da preferire
//const ShowProject = (props: { id: number; text: string }) => {
const ShowProject = ({ id, text }: { id: number; text: string }) : JSX.Element => {

    const link = `/project/${id}`;

    return (
        <a href={link} style={{ border: "1px solid green" }} title={text}>
            {text}
        </a>
    );
};

export default ShowProject;
