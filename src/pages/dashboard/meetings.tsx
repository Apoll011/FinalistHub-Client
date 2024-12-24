import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Modal, Alert } from 'react-bootstrap';

import {Meeting, MeetingList, MeetingsApi} from "api";
import ShowIfAdmin from "components/show_if_admin.tsx";

const MeetingApi = {
    createMeeting: (formData: { date: string, time: string, location: string, agenda: string }) =>
        new MeetingsApi().createMeetingMeetingsPost(formData),
    uploadMinutes: (meetingId: string, formData: {file: Blob}) =>
        new MeetingsApi().uploadMinutesMeetingsMeetingIdMinutesPost({meetingId: meetingId, file: formData["file"]}),
    updateMeeting: (meetingId: string, formData: { date: string, time: string, location: string, agenda: string }) =>
        new MeetingsApi().updateMeetingMeetingsMeetingIdPatch({meetingId: meetingId, meetingBase: formData}),
    deleteMeeting: (meetingId: string) =>
        new MeetingsApi().deleteMeetingMeetingsMeetingIdDelete({meetingId: meetingId}),
    getUpcomingMeetings: () =>
        new MeetingsApi().getUpcomingMeetingsMeetingsUpcomingGet(),
    getMeetingMinutes: (meetingId: string) =>
        new MeetingsApi().getMeetingMinutesMeetingsMeetingIdMinutesGet({meetingId: meetingId})
};

export const MeetingManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [uploadFile, setUploadFile] = useState<Blob | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [meetings, setMeeting] = useState<MeetingList>( { meetings: [] });

    useEffect(() => {
        loadData().then(() => console.log("Loaded meetings."));
    }, []);

    const loadData = async () => {
        const meeting = await MeetingApi.getUpcomingMeetings();
        setMeeting(meeting);
    }

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
        agenda: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (selectedMeeting) {
                await MeetingApi.updateMeeting(selectedMeeting.id, formData);
            } else {
                await MeetingApi.createMeeting(formData);
            }
            setAlert({ show: true, message: 'Reunião salvada com sucesso!', variant: 'success' });
            setShowModal(false);
            loadData().then(() => console.log("Loaded meetings."));
        } catch {
            setAlert({ show: true, message: 'Erro salvando a reunião!', variant: 'danger' });
        }
    };

    const handleDelete = async (meetingId: string) => {
        if (window.confirm('Tems certeza que queres apaga está reunião?')) {
            try {
                await MeetingApi.deleteMeeting(meetingId);
                setAlert({ show: true, message: 'Reunião deletada com sucesso!', variant: 'success' });
                loadData().then(() => console.log("Loaded meetings."));
            } catch {
                setAlert({ show: true, message: 'Erro deletando a reunião!', variant: 'danger' });
            }
        }
    };

    const handleUploadMinutes = async (meetingId: string) => {
        if (!uploadFile) return;

        try {
            await MeetingApi.uploadMinutes(meetingId, { file: uploadFile });
            setAlert({ show: true, message: 'Publicado a ATA!', variant: 'success' });
            setUploadFile(null);
        } catch (error) {
            setAlert({ show: true, message: 'Erro publicando a ATA: ' + error, variant: 'danger' });
        }
    };

    const downloadMinutes = async (meetingId: string) => {
        try {
            const response = await MeetingApi.getMeetingMinutes(meetingId);
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'meeting-minutes.docx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            setAlert({ show: true, message: 'Erro baixando a ATA', variant: 'danger' });
        }
    };

    const openModal = (meeting: Meeting | null = null) => {
        if (meeting) {
            setFormData({
                date: meeting.date,
                time: meeting.time,
                location: meeting.location,
                agenda: meeting.agenda
            });
            setSelectedMeeting(meeting);
        } else {
            setFormData({ date: '', time: '', location: '', agenda: '' });
            setSelectedMeeting(null);
        }
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false, message: "", variant: "" })} dismissible>
                    {alert.message}
                </Alert>
            )}

            <Row className="mb-4">
                <Col>
                    <h2>Gerenciamento de Reuniões</h2>
                </Col>
                <ShowIfAdmin>
                    <Col xs="auto">
                        <Button variant="primary" onClick={() => openModal()}>
                            Nova Reunião
                        </Button>
                    </Col>
                </ShowIfAdmin>
            </Row>

            <Row>
                {meetings.meetings.map((meeting) => (
                    <Col key={meeting.id} lg={4} md={6} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Reunião</Card.Title>
                                <Card.Text>
                                    <strong>Data:</strong> {meeting.date}<br />
                                    <strong>Hora:</strong> {meeting.time}<br />
                                    <strong>Local:</strong> {meeting.location} <br/>
                                    <strong>Agenda:</strong> {meeting.agenda}
                                </Card.Text>
                                <ShowIfAdmin>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => openModal(meeting)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(meeting.id)}>
                                        Apagar
                                    </Button>
                                </ShowIfAdmin>
                                <Button variant="success" size="sm" onClick={() => downloadMinutes(meeting.id)}>
                                    ATA
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <ShowIfAdmin>
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedMeeting ? 'Editar Reunião' : 'Nova Reunião'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Hora</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Local</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Agenda</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="agenda"
                                    value={formData.agenda}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            {selectedMeeting && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Publicar ATA</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                    {uploadFile && (
                                        <Button
                                            variant="outline-primary"
                                            className="mt-2"
                                            onClick={() => handleUploadMinutes(selectedMeeting.id)}
                                        >
                                            Publicar
                                        </Button>
                                    )}
                                </Form.Group>
                            )}
                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit">
                                    Salvar
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </ShowIfAdmin>
        </div>
    );
};

export default MeetingManagement;