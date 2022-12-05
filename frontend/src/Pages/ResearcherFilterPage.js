import React,{Component} from 'react';
import { Button, Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"

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

            idFilter:"",
            conversation_idFilter:"",
            chatlog_idFilter: "",
            timeFilter: "",
            chatlogFilter: "",
            is_userFilter: "",
            deltaFilter: "",
            chatWithoutFilter:[]
        }
    }

    FilterFn(){
        var idFilter=this.state.idFilter;
        var conversation_idFilter = this.state.conversation_idFilter;
        var chatlog_idFilter=this.state.chatlog_idFilter;
        var timeFilter=this.state.timeFilter;
        var chatlogFilter=this.state.chatlogFilter;
        var is_userFilter=this.state.is_userFilter;
        var deltaFilter=this.state.deltaFilter;


        var filteredData=this.state.chatWithoutFilter.filter(
            function(el){
                return el.id.toString().toLowerCase().includes(
                    idFilter.toString().trim().toLowerCase()
                )&&
                el.conversation_id.toString().toLowerCase().includes(
                    conversation_idFilter.toString().trim().toLowerCase()
                )&&
                el.chatlog_id.toString().toLowerCase().includes(
                    chatlog_idFilter.toString().trim().toLowerCase()
                )&&
                el.time.toString().toLowerCase().includes(
                    timeFilter.toString().trim().toLowerCase()
                )&&
                el.is_user.toString().toLowerCase().includes(
                    is_userFilter.toString().trim().toLowerCase()
                )&&
                el.chatlog.toString().toLowerCase().includes(
                    chatlogFilter.toString().trim().toLowerCase()
                )&&
                el.delta.toString().toLowerCase().includes(
                    deltaFilter.toString().trim().toLowerCase()
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

    changeidFilter = (e)=>{
        this.state.idFilter=e.target.value;
        this.FilterFn();
    }
    changeConversationIdFilter = (e)=>{
        this.state.conversation_idFilter=e.target.value;
        this.FilterFn();
    }
    changeChatlogIdFilter = (e)=>{
        this.state.chatlog_idFilter=e.target.value;
        this.FilterFn();
    }
    changeTimeFilter = (e)=>{
        this.state.timeFilter=e.target.value;
        this.FilterFn();
    }
    changeIsUserFilter = (e)=>{
        this.state.is_userFilter=e.target.value;
        this.FilterFn();
    }
    changeChatlogFilter = (e)=>{
        this.state.chatlogFilter=e.target.value;
        console.log(this.state.chatlogFilter)
        this.FilterFn();
    }
    changeDeltaFilter = (e)=>{
        this.state.deltaFilter=e.target.value;
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
            id,
            conversation_id,
            chatlog_id,
            time,
            is_user,
            chatlog,
            delta
        }=this.state;

        return(
<div>
    <Table>
    <Thead>
    <Tr>
        <Th>
            <div> 
            <Input name="id_contains" onChange={this.changeidFilter} placeholder="Filter"/>
            <Button onClick={()=>this.sortResult('id',true)} colorScheme='blue' size='sm'>
                <ChevronUpIcon/>
            </Button>

            <Button onClick={()=>this.sortResult('id',false)} colorScheme='blue' size='sm'>
                <ChevronDownIcon/>
            </Button>

            </div>
            id
        </Th>

        <Th>
            <div>
            <Input onChange={this.changeConversationIdFilter} placeholder="Filter"/>
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
            <Input onChange={this.changeChatlogIdFilter} placeholder="Filter"/>
            <Button onClick={()=>this.sortResult('chatlog_id',true)} colorScheme='blue' size='sm'>
                <ChevronUpIcon/>
            </Button>

            <Button onClick={()=>this.sortResult('chatlog_id',false)} colorScheme='blue' size='sm'>
                <ChevronDownIcon/>
            </Button>
            </div>
            chatlog_id
        </Th>

        <Th>
            <div>
            <Input onChange={this.changeTimeFilter} placeholder="Filter"/>
            <Button onClick={()=>this.sortResult('time',true)} colorScheme='blue' size='sm'>
                <ChevronUpIcon/>
            </Button>

            <Button onClick={()=>this.sortResult('time',false)} colorScheme='blue' size='sm'>
                <ChevronDownIcon/>
            </Button>
            </div>
            time
      
        </Th>


        <Th>
            <div>
            <Input onChange={this.changeChatlogFilter} placeholder="Filter"/>

            <Button onClick={()=>this.sortResult('chatlog',true)} colorScheme='blue' size='sm'>
                <ChevronUpIcon/>
            </Button>

            <Button onClick={()=>this.sortResult('chatlog',false)} colorScheme='blue' size='sm'>
                <ChevronDownIcon/>
            </Button>
            </div>
            chatlog
      
        </Th>
        <Th>
            <div>
            <Input onChange={this.changeIsUserFilter} placeholder="Filter"/>
            <Button onClick={()=>this.sortResult('is_user',true)} colorScheme='blue' size='sm'>
                <ChevronUpIcon/>
            </Button>

            <Button onClick={()=>this.sortResult('is_user',false)} colorScheme='blue' size='sm'>
                <ChevronDownIcon/>
            </Button>
            </div>
            is_user
      
        </Th>

        <Th>
            <div>
            <Input onChange={this.changeDeltaFilter} placeholder="Filter"/>
            <Button onClick={()=>this.sortResult('delta',true)} colorScheme='blue' size='sm'>
                <ChevronUpIcon/>
            </Button>
            <Button onClick={()=>this.sortResult('delta',false)} colorScheme='blue' size='sm'>
                <ChevronDownIcon/>
            </Button>
            </div>
            delta
      
        </Th>
        
    </Tr>
    </Thead>
    <Tbody>
        {chat.map(ch=>
            <Tr key={ch.id}>
                <Td>{ch.id}</Td>
                <Td>{ch.conversation_id}</Td>
                <Td>{ch.chatlog_id}</Td>
                <Td>{ch.time}</Td>
                <Td maxWidth={"150px"}>{ch.chatlog}</Td>
                <Td>{ch.is_user}</Td>
                <Td>{ch.delta}</Td>
            </Tr>
            )}
        
    </Tbody>
    </Table>
    <div>
     
     </div>

</div>

        )
    }
}

export default ResearcherFilterPage;