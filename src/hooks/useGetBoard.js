import {useQuery} from "@tanstack/react-query";
import axios from 'axios';
import { GW_URL,adminConfig,Board } from '../config';


const mappedBoardData=(boardList)=>{
    let newMappedBoardList=[];
    for(let bd of Board)
    {
        for(let bl of boardList){
            if(bl===bd.board_name)
            {
                newMappedBoardList.push(bd);
            }
        }
    }
    return newMappedBoardList;
}
const useBoardIdQuery = (school_id) => {
  return useQuery(["boardIds", school_id], async () => {
    const res = await axios.get(`${GW_URL}/schools/${school_id}/getBoardId`, adminConfig);
    let board_list= res?.data?.board_name;
 
   board_list=mappedBoardData(board_list);
    return board_list;
  });
};

export default useBoardIdQuery;
