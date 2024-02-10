import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { url } from '../const';
import { useNavigate, useParams } from 'react-router-dom';
import './editTask.scss';

export const EditTask = () => {
  const navigate = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState('');
  const [limit, setlimit] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const [detail, setDetail] = useState('');
  const [isDone, setIsDone] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handlelimitChange = (e) => setlimit(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done');
  const onUpdateTask = () => {
    console.log(isDone);
    const data = {
      title: title,
      detail: detail,
      limit: `${limit}:00Z`,
      done: isDone,
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };
 /* useEffect(() => {
    setRemainingTime(calculateRemainingTime());
  },[limit])
*/
  useEffect(() => {
    setlimit(limit.substring(0,16));
    if (limit) {
      const calculateRemainingTime = () => {
        const limitDate = new Date(limit);
        const now = new Date();
        const diff = limitDate.getTime() - now.getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          return `${days}日 ${hours}時間 ${minutes}分`;
        } else {
          return '期限切れ';
        }
      };
  
      setRemainingTime(calculateRemainingTime());
    }
  }, [limit]);

 /* const calculateRemainingTime = () => {
    if (limit) {
      // Parse limit as local time and convert to Japan time
      const limitDate = new Date(limit);
      // Get current time in local time
      const now = new Date();
     // const japantime = new Date(now.getTime() + (9 * 3600000))//
      const diff = limitDate - now;
      /*if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        return `${days}日 ${hours}時間 ${minutes}分`;
      } else {
        return '期限切れ';
      }
    }
    return '';
  };
*/
  /*useEffect(() => { //初回レンダリング時と再発火時で9時間のずれがある
    const calculateRemainingTime = () => {
      if (limit) {
        // Parse limit as local time and convert to Japan time
        const limitDate = new Date(limit);
        
        // Get current time in local time
        const now = new Date();
        const japantime = new Date(now.getTime() + (9 * 3600000))
        const diff = limitDate - japantime;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          return `${days}日 ${hours}時間 ${minutes}分`;
        } else {
          return '期限切れ';
        }
      }
      return '';
    };
      const time = calculateRemainingTime();
      setRemainingTime(time);
  }, [limit]);
  */
  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDetail(task.detail);
        setlimit(task.limit);
        setIsDone(task.done);
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, [cookies.token, listId, taskId]);

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>タスク期限日時</label>
          <br />
          <input
            type="datetime-local"
            onChange={handlelimitChange}
            className="edit-task-limit"
            value={limit/*.substring(0,16)*/}
          />
          <br />
          <label>タスク残り日時</label>
          <br />
          <input
            type="text"
            className="edit-task-remaining"
            value={remainingTime}
            readOnly
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  );
};
