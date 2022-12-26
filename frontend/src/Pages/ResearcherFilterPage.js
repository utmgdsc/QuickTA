import React,{Component} from 'react';
import {Button, Table, Thead, Tbody, Tr, Th, Td, Input, HStack, TableContainer} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import TopNav from "../Components/TopNav";
import {Link} from 'react-router-dom';

export const variables={
    API_URL:"http://127.0.0.1:8000/api/",
}

export class ResearcherFilterPage extends Component{
    constructor(props){
        super(props);

        this.state={
            chat:[],
            modalTitle:"",
            conversation_id:"",
            id:0,

            conversation_idFilter:"",
            course_idFilter: "",
            user_idFilter: "",
            starttimeFilter: "",
            endtimeFilter: "",
            statusFilter: "",
            reportFilter: "",
            ratingFilter: "",
            feedback_msgFilter: "",
            chatWithoutFilter:[]
        }
    }

    FilterFn(){
        var conversation_idFilter = this.state.conversation_idFilter;
        var course_idFilter=this.state.course_idFilter;
        var user_idFilter = this.state.user_idFilter;
        var starttimeFilter=this.state.starttimeFilter;
        var endtimeFilter=this.state.endtimeFilter;
        var statusFilter=this.state.statusFilter;
        var reportFilter=this.state.reportFilter;
        var ratingFilter=this.state.ratingFilter;
        var feedback_msgFilter=this.state.feedback_msgFilter;


        var filteredData=this.state.chatWithoutFilter.filter(
            function(el){
                return el.conversation_id.toString().toLowerCase().includes(
                    conversation_idFilter.toString().trim().toLowerCase()
                )&&
                el.course_id.toString().toLowerCase().includes(
                    course_idFilter.toString().trim().toLowerCase()
                )&&
                el.user_id.toString().toLowerCase().includes(
                    user_idFilter.toString().trim().toLowerCase()
                )&&
                el.starttime.toString().toLowerCase().includes(
                    starttimeFilter.toString().trim().toLowerCase()
                )&&
                el.endtime.toString().toLowerCase().includes(
                    endtimeFilter.toString().trim().toLowerCase()
                )&&
                el.status.toString().toLowerCase().includes(
                    statusFilter.toString().trim().toLowerCase()
                )&&
                el.report.toString().toLowerCase().includes(
                    reportFilter.toString().trim().toLowerCase()
                )&&
                el.rating.toString().toLowerCase().includes(
                    ratingFilter.toString().trim().toLowerCase()
                )&&
                el.feedback_msg.toString().toLowerCase().includes(
                    feedback_msgFilter.toString().trim().toLowerCase()
                )
            }
        );

        this.setState({chat:filteredData});

    }

    sortResult(prop,asc){
        var sortedData=this.state.chatWithoutFilter.sort(function(a,b){
            if(asc){
                return (a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
            }
            else{
                return (b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
            }
        });

        this.setState({chat:sortedData});
    }

    changeConversationIdFilter = (e)=>{
        this.state.conversation_idFilter=e.target.value;
        this.FilterFn();
    }
    changeCourseIdFilter = (e)=>{
        this.state.course_idFilter=e.target.value;
        this.FilterFn();
    }
    changeUserIdFilter = (e)=>{
        this.state.user_idFilter=e.target.value;
        this.FilterFn();
    }
    changeStartTimeFilter = (e)=>{
        this.state.starttimeFilter=e.target.value;
        this.FilterFn();
    }
    changeEndTimeFilter = (e)=>{
        this.state.endtimeFilter=e.target.value;
        this.FilterFn();
    }
    changeStatusFilter = (e)=>{
        this.state.statusFilter=e.target.value;
        this.FilterFn();
    }
    changeReportFilter = (e)=>{
        this.state.reportFilter=e.target.value;
        this.FilterFn();
    }
    changeRatingFilter = (e)=>{
        this.state.ratingFilter=e.target.value;
        this.FilterFn();
    }
    changeFeedbackMsgFilter = (e)=>{
        this.state.feedback_msgFilter=e.target.value;
        this.FilterFn();
    }

    refreshList(){
        fetch(variables.API_URL+'researcher/get-filtered-chatlogs')
        .then(response=>response.json())
        .then(data=>{
            this.setState({chat:data,chatWithoutFilter:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }


    render(){
        const {
            chat,
            modalTitle,
            conversation_id,
            course_id,
            user_id,
            start_time,
            end_time,
            status,
            report,
            rating,
            feedback_msg
        }=this.state;

        return(
<div>
    <TopNav UTORid={this.props.UTORid}/>
    <div style={{marginInline: "8vw"}}>
        <HStack spacing={3}>
            <Link to={"/"}>
                <Button colorScheme={"blue"} style={{backgroundColor: '#2C54A7', color: 'white'}}>To Models Page</Button>
            </Link>
            <Link to={"/ResearcherAnalytics"}>
                <Button colorScheme={"blue"} style={{backgroundColor: '#2C54A7', color: 'white'}}>To Analytics Page</Button>
            </Link>
        </HStack>
        <Table style={{
            width: "90vw",
            height: "90vh",
        }}>
            <Thead>
                <Tr>
                    <Th>
                        <div>
                            <Input name="id_contains" onChange={this.changeConversationIdFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('conversation_id',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>

                            <Button onClick={()=>this.sortResult('conversation_id',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>

                        </div>
                        conversation_id
                    </Th>

                    <Th>
                        <div>
                            <Input onChange={this.changeCourseIdFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('course_id',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>

                            <Button onClick={()=>this.sortResult('course_id',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        course_id
                    </Th>

                    <Th>
                        <div>
                            <Input onChange={this.changeUserIdFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('user_id',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>

                            <Button onClick={()=>this.sortResult('user_id',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        user_id
                    </Th>

                    <Th>
                        <div>
                            <Input onChange={this.changeStartTimeFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('start_time',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>

                            <Button onClick={()=>this.sortResult('start_time',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        start_time

                    </Th>


                    <Th>
                        <div>
                            <Input onChange={this.changeEndTimeFilter} placeholder="Filter"/>

                            <Button onClick={()=>this.sortResult('end_time',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>

                            <Button onClick={()=>this.sortResult('end_time',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        end_time

                    </Th>
                    <Th>
                        <div>
                            <Input onChange={this.changeStatusFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('status',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>

                            <Button onClick={()=>this.sortResult('status',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        status

                    </Th>

                    <Th>
                        <div>
                            <Input onChange={this.changeReportFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('report',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>
                            <Button onClick={()=>this.sortResult('report',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        report

                    </Th>

                    <Th>
                        <div>
                            <Input onChange={this.changeRatingFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('rating',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>
                            <Button onClick={()=>this.sortResult('rating',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        rating

                    </Th>

                    <Th>
                        <div>
                            <Input onChange={this.changeFeedbackMsgFilter} placeholder="Filter"/>
                            <Button onClick={()=>this.sortResult('feedback_msg',true)} colorScheme='blue' size='sm'>
                                <ChevronUpIcon/>
                            </Button>
                            <Button onClick={()=>this.sortResult('feedback_msg',false)} colorScheme='blue' size='sm'>
                                <ChevronDownIcon/>
                            </Button>
                        </div>
                        feedback_msg

                    </Th>

                </Tr>
            </Thead>
            <Tbody>
                {chat.map(ch=>
                  <Tr key={ch.conversation_id}>
                      <Td>{ch.conversation_id}</Td>
                      <Td>{ch.course_id}</Td>
                      <Td>{ch.user_id}</Td>
                      <Td>{ch.start_time}</Td>
                      <Td>{ch.end_time}</Td>
                      <Td>{ch.status}</Td>
                      <Td>{ch.report}</Td>
                      <Td>{ch.rating}</Td>
                      <Td>{ch.feedback_msg}</Td>
                  </Tr>
                )}

            </Tbody>
        </Table>
        <div>

        </div>
    </div>

</div>

        )
    }
}

export default ResearcherFilterPage;