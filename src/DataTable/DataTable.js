import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, Button, Space, Form, Input } from "antd";

import { isEmpty } from "lodash";      // Utility funtion

const DataTable = () => {
    const [gridData, setGridData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const response = await axios.get(
            "https://jsonplaceholder.typicode.com/comments"
        );
        setGridData(response.data);
        setLoading(false);
    };
    const handleDelete = (value) => {
        const dataSource = [...modifiedData];
        const filterData = dataSource.filter((item) => item.id !== value.id);
        setGridData(filterData);
    }

    const modifiedData = gridData.map(({ body, ...item }) => ({
        ...item,
        key: item.id,
        comment: isEmpty(body) ? item.comment : body,
    }));

    const edit = (record) => {
        form.setFieldsValue({        //inbuild methods
            name: "",
            email: "",
            comment: "",
            ...record

        });
        setEditingKey(record.key);

    }
    const cancel = () => {
        setEditingKey("");
    }
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...modifiedData];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {     // means does't find the index
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setGridData(newData);
                setEditingKey("");
            }
        } catch (error) {
            console.log("error", error);
        }
    };
    const EditableCell = ({                  // editable the we need this input field that's why
        editing,
        dataIndex,
        title,
        record,
        children,
        ...restProps
    }) => {
        const input = <Input />            
        return (
            <td {...restProps}>
                {editing ? (     
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please input ${title}`
                            }
                        ]}
                    >
                        {input}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        )
    }                
    const columns = [                                //create a column of id, name, email, comment, action 
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            align: "center",
            editable: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            align: "center",
            editable: true,
        },
        {
            title: "Comment",
            dataIndex: "comment",
            align: "center",
            editable: true,
        },
        {
            title: "Action",
            dataIndex: "action",
            align: "center",
            render: (text, record) => {          //render it is the rendered of the table cell
                const editable = isEditing(record);
                return modifiedData.length >= 1 ? (
                    <Space>
                        <td>
                        <Popconfirm
                            title="sure to delete?"
                            onConfirm={() => handleDelete(record)}

                        >
                            <Button type="primary" disabled={editable} style={{variant: "danger" , color: "red"}}>
                                Delete
                            </Button>
                        </Popconfirm>
                        {editable ? (
                            <span>
                                <Space size="middle">
                                    <Button
                                        onClick={(e) => save(record.key)}
                                        type="primary"
                                        style={{ marginRight: 8 }}
                                    >
                                        Save
                                    </Button>
                                    <Popconfirm
                                        title="sure to cancel?"
                                        onConfirm={cancel}
                                    >
                                        <Button>Cancel</Button>
                                    </Popconfirm>
                                </Space>
                            </span>
                        ) : (
                            <Button onClick={() => edit(record)} type="primary">
                                Edit
                            </Button>
                        )}
                        </td>
                    </Space>

                ) : null;
            },
        },
    ];

    const isEditing = (record) => {
        return record.key === editingKey;
    }
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            })
        }
    })
    return (
        <div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,

                        }
                    }}
                    columns={mergedColumns}
                    dataSource={modifiedData}
                    bordered
                    loading={loading}
                    pagination />
            </Form>
        </div>
    );
};

export default DataTable;