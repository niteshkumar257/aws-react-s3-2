import {react,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import { colorHash,getIndianDate,EachTaskStatus } from "../../config";
import ChapterModal from "./ChapterModal";

const TaskCard = ({ chapter, taskUpdate, setTaskUpdated ,message}) => {
    const [chapterOpen, setChapterOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState({});
    const navigate = useNavigate();
    const { teacherId: teacher_id } = useParams();
  
    const onChapterDetails = (chapter_id) => {
      setSelectedChapter(chapter);
      setChapterOpen(true);
    };
    const handleChapterClose = () => {
      setChapterOpen(false);
    };

  
    return (
      <div
        style={{ border: `2px solid ${colorHash[chapter.chapter_tt_status]}` }}
        className="task-card-container"
      >
        <div className="task-info-container">
          <span>Chapter name: {chapter?.chapter_name}</span>
          <span>Chatper: {chapter?.chapter_id}</span>
          <span>Start Date: {getIndianDate(chapter.chapter_start_time)}</span>
          <span>Dead Line: {getIndianDate(chapter.chapter_deadline)}</span>
          <span style={{ color: colorHash[chapter.chapter_tt_status] }}>
            Status: {EachTaskStatus(chapter.chapter_tt_status)}
          </span>
          <div className="task-action-container">
            <button onClick={onChapterDetails}>Details</button>
          </div>
        </div>
  
        <ChapterModal
          open={chapterOpen}
          onClose={handleChapterClose}
          chapter={chapter}
          selectedChapter={selectedChapter}
          setTaskUpdated={setTaskUpdated}
          teacher_id={teacher_id}
          taskUpdate={taskUpdate}
          message={message}
        />
      </div>
    );
  };

  export default TaskCard;