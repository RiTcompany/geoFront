import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {InputGroup, Modal} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, {useEffect, useState} from "react";
import {sendGetRequest, sendPostRequest} from "../utils/requests";
import {useParams} from "react-router-dom";






function AdminEmployee() {
    const { id } = useParams();
    const [showDropdown1, setShowDropdown1] = useState({
        show1 :false,
        show2:false,
    });
    const [tasks, setTasks] = useState([])
    const [disabled, setDisabled] = useState(false);
    const [employees, setEmployees] = useState([])
    const [sendData, setSendData] = useState({
        task: null,
        employees: null,
        admin_id:null,
        item_id:null

    })

    const [formData, setFormData] = useState({
        task: '',
        employees: '',



    })

    const handleSubmit = (e) => {
        e.preventDefault();


        if (!sendData.task || !sendData.employees || !sendData.admin_id || !sendData.item_id) {
            alert('Заполните все поля');
            return;
        }


        sendPostRequest('employee-task/create/', {
            task_id: sendData.task,
            employee_id: sendData.employees,
            admin_id: sendData.admin_id,
            item_id: sendData.item_id
        })
            .then((response) => {
                console.log('Задача успешно создана', response);
                alert('Задача успешно создана');
            })
            .catch((error) => {
                console.error('Ошибка при создании задачи', error);
                alert('Ошибка при создании задачи');
            });
    };



    useEffect(() => {
        console.log('sendData updated:', sendData);
    }, [sendData]);




    useEffect(() => {
        sendGetRequest(`employees/`)
            .then((response) => {
                console.log(response)
                setEmployees(response);
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [])

    useEffect(() => { // тут все задачи берутся по id router
        sendGetRequest(`tasks/?plot_id=${id}`)
            .then((response) => {
                console.log(response)
                setTasks(response);
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [])


    const handleDropdownToggle1 = (num) => {

        setShowDropdown1({
            show1: num === 1 ? !showDropdown1.show1 : false,
            show2: num === 2 ? !showDropdown1.show2 : false
        });
    };

    const handleTasksClick = (item) => {
        console.log('Button clicked:', item);
        setShowDropdown1(0);

        // Обновляем formData для отображения названия задачи
        setFormData({ ...formData, task: item.title });

        // Обновляем sendData для последующей отправки
        setSendData({
            ...sendData,
            task: item.id,
            item_id: item.item,
            admin_id: item.admin
        });

        setDisabled(false);
    };
    const handleEmployeesClick = (item) => {
        console.log('Button clicked:', item);
        setShowDropdown1(false);
        setFormData({ ...formData, employees: `${item.name} ${item.surname}`});
        setSendData({ ...sendData, employees: item.id});
        setDisabled(false);
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    return (
        <>
            <Container>
                <div style={{position: 'relative'}}>
                    <Button
                        variant="outline-dark"
                        style={{
                            borderWidth: '2px',
                            borderRadius: '20px',
                            marginTop: '60px',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            zIndex: '1',
                        }}
                        href='/admin-task-type'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                    </Button>
                    <div className='header'>GD TIME<br/>Постановка задач</div>
                </div>
                <div className='block'>
                    <div className='search-group'>
                        <div className="d-grid gap-2">

                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Ввведите задачу</Form.Label>
                                    <InputGroup className="mb-3" controlId="formBasicPassword" >
                                        <Form.Control
                                            style={{borderRadius: "20px"}}

                                            name="item"
                                            placeholder="Поиск..."
                                            className='login'
                                            size='lg'
                                            value={formData.task}
                                            onChange={handleInputChange}
                                            onClick={() => handleDropdownToggle1(1)}

                                        />

                                    </InputGroup>



                                </Form.Group>

                                {showDropdown1.show1 &&tasks.length >0 ? (
                                    <div className='block'>
                                        <div className='search-list' >
                                            <Row>
                                                <Col>
                                                    <div className="d-grid gap-2">
                                                        {tasks.map((item) => (
                                                            <Button key={item.id}
                                                                    className='admin-botton-color'
                                                                    variant="dark"
                                                                    size='lg'

                                                                    onClick={() => handleTasksClick(item)}>
                                                                {item.title}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <div className='block'>
                                        <div className='search-list'>
                                            <Row>
                                                <Col>
                                                    <div className="d-grid gap-2">
                                                        {tasks.map((item) => (
                                                            <Button key={item.id}
                                                                    className='admin-botton-color'
                                                                    variant="dark"
                                                                    size='lg'

                                                                    onClick={() =>   handleTasksClick(item)}>
                                                                {item.title}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}


                                <Form.Group>
                                    <Form.Label>Ввведите Работника</Form.Label>
                                    <InputGroup className="mb-3" controlId="formBasicPassword" >
                                        <Form.Control
                                            style={{borderRadius: "20px"}}

                                            name="item"
                                            placeholder="Поиск..."
                                            className='login'
                                            size='lg'
                                            value={formData.employees}
                                            onChange={handleInputChange}
                                            onClick={() => handleDropdownToggle1(2)}

                                        />

                                    </InputGroup>



                                </Form.Group>

                                {showDropdown1.show2 &&employees.length >0 ? (
                                    <div className='block'>
                                        <div className='search-list' >
                                            <Row>
                                                <Col>
                                                    <div className="d-grid gap-2">
                                                        {employees.map((item) => (
                                                            <Button key={item.id}
                                                                    className='admin-botton-color'
                                                                    variant="dark"
                                                                    size='lg'

                                                                    onClick={() => handleEmployeesClick(item)}>
                                                                {item.name} {item.surname}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <div className='block'>
                                        <div className='search-list'>
                                            <Row>
                                                <Col>
                                                    <div className="d-grid gap-2">
                                                        {tasks.map((item) => (
                                                            <Button key={item.id}
                                                                    className='admin-botton-color'
                                                                    variant="dark"
                                                                    size='lg'

                                                                    onClick={() => handleEmployeesClick(item)}>
                                                                {item.title}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}



                                <div className="d-grid gap-2">
                                    <Button
                                        className='admin-botton-color'
                                        variant="dark"
                                        size='lg'
                                        style={{marginTop: "80px",
                                            marginBottom: "80px"}}
                                        type='submit'
                                    >
                                        Добавить задачу
                                    </Button>
                                </div>
                            </Form>

                        </div>
                    </div>
                </div>



            </Container>
        </>
    )


}
export default AdminEmployee;