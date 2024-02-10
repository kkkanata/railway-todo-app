import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header';
import './newTask.scss';
import { useNavigate } from 'react-router-dom';

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState('');
  const [limit, setlimit] = useState(''); // 
  const [detail, setDetail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handlelimitChange = (e) => setlimit(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleSelectList = (id) => setSelectListId(id);

  const onCreateTask = () => {
    const data = {
      title: title,
      detail: detail,
      /*limit: convertDatetimeLocalToISOString(limit),*/
      limit: `${limit}:00Z`,
      done: false,
    };

    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, [cookies.token]);
/*
  function convertDatetimeLocalToISOString(datetimeLocal) {
    // datetimeLocalはdatetime-local形式の文字列と仮定します
    const [datePart, timePart] = datetimeLocal.split('T'); // 日付部分と時刻部分に分割

    // 年、月、日を取得
    const [year, month, day] = datePart.split('-');
    
    // 時、分を取得
    const [hours, minutes] = timePart.split(':');

    // ISO 8601形式の文字列を作成し、タイムゾーン情報を追加
    const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00Z`;

    return isoString;
}
*/

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
          >
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="new-task-title"
          />
          <br /> 
          <label>タスク期限日時</label>
          <br />
          <input
            type="datetime-local"
            onChange={handlelimitChange}
            className="new-task-deadLineDate"
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="new-task-detail"
          />
          <br />
          <button
            type="button"
            className="new-task-button"
            onClick={onCreateTask}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
