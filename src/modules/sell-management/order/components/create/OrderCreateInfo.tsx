import {
    Avatar,
    Button,
    Card,
    Col,
    Flex,
    Form,
    Input,
    List,
    Row,
    Select,
    Tooltip,
    Typography,
    notification,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { RULES_FORM } from '@/utils/validator';
import {
    ORDERS_PAIDS,
    ORDERS_PAYMENTS,
    ORDERS_STATUSES,
} from '@/constants/config';
import { ProductProps } from '@/models/product';
import { ProductColorsProps } from '@/models/product-color';
import { ProductSizeProps } from '@/models/product-size';
import EditProductModal from './EditProductModal';
import Slash from '@/modules/shared/divider/slash/Slash';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import { CACHE_ORDER, useCreateOrder } from '@/loaders/order.loader';
import { queryClient } from '@/lib/react-query';
import { useOrderDetailState } from '@/stores/order-detail.store';
import { OrderDetailProps } from '@/models/order-detail';

const OrderCreateInfo = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'sell' });
    const [form] = useForm();
    
    const [transportFee, setTransportFee] = useState<number>(0);
    const [textContent, setTextContent] = useState<string>('');

    const [orderDetails, setOrderDetails] = useOrderDetailState((state) => [
        state.orderDetails,
        state.setOrderDetails,
    ]);

    const createOrder = useCreateOrder({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_ORDER.SEARCH]);

                notification.success({
                    message: t('order.create_success'),
                });

                setOrderDetails([]);
                setTextContent('');
                setTransportFee(0);
                form.resetFields();
                form.setFieldValue("customer", t("order.customer_direct"))
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleDelete = (orderDetail: OrderDetailProps) => {
        setOrderDetails(
            orderDetails?.filter(
                (d: OrderDetailProps) =>
                    (d?.product as ProductProps)?._id !=
                        (orderDetail?.product as ProductProps)?._id &&
                    (d?.color as ProductColorsProps)?._id !=
                        (orderDetail?.color as ProductColorsProps)?._id &&
                    (d?.size as ProductSizeProps)?._id !=
                        (orderDetail?.size as ProductSizeProps)?._id,
            ),
        );
    };

    useEffect(() => {
        form.setFieldValue("customer", t("order.customer_direct"))
    }, [])

    useEffect(() => {
        form.setFieldValue(
            'total_calculate',
            Number(
                orderDetails?.reduce(
                    (acc, item) =>
                        acc + Number(item?.quantity) * Number(item?.price),
                    0,
                ),
            )?.toLocaleString(),
        );
        form.setFieldValue(
            'total',
            Number(
                orderDetails?.reduce(
                    (acc, item) =>
                        acc + Number(item?.quantity) * Number(item?.price),
                    0,
                ) + Number(transportFee),
            )?.toLocaleString(),
        );
    }, [orderDetails, transportFee]);

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                createOrder.mutate({
                    ...values,
                    customer: "",
                    details: orderDetails,
                    note: textContent,
                    total: parseFloat(values?.total?.replace(/[^0-9.-]+/g, '')),
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    return (
        <>
            <div className="layout">
                <Card
                    style={{ minHeight: 1024 }}
                    title={t('order.order_bill_info')}
                    extra={
                        <Button
                            loading={createOrder?.isLoading}
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSubmit}
                        >
                            {t('order.save')}
                        </Button>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={12} lg={12}>
                            <Form form={form} layout="vertical">
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'customer'}
                                    label={t('order.fields.customer')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('order.fields.customer')}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'total_calculate'}
                                    label={t('order.fields.total')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('order.fields.total')}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'transportFee'}
                                    label={t('order.fields.transport_fee')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'order.fields.transport_fee',
                                        )}
                                        onChange={(e) =>
                                            setTransportFee(
                                                Number(e?.target?.value),
                                            )
                                        }
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'total'}
                                    label={t('order.fields.total_calculate')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'order.fields.total_calculate',
                                        )}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'status'}
                                    label={t('order.fields.status')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={ORDERS_STATUSES}
                                        placeholder={t('order.fields.status')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'payment'}
                                    label={t('order.fields.payment')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={ORDERS_PAYMENTS}
                                        placeholder={t('order.fields.payment')}
                                    />
                                </FormItem>

                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'paid'}
                                    label={t('order.fields.paid_status')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={ORDERS_PAIDS}
                                        placeholder={t(
                                            'order.fields.paid_status',
                                        )}
                                    />
                                </FormItem>

                                {/* RICH TEXT EDITOR */}
                                <ReactQuill
                                    theme="snow"
                                    value={textContent}
                                    onChange={setTextContent}
                                    modules={REACT_QUILL_MODULES}
                                    formats={REACT_QUILL_FORMAT}
                                    style={{ height: 300 }}
                                />
                            </Form>
                        </Col>
                        <Col span={24} md={12} lg={12}>
                            <Row>
                                <Typography.Text>
                                    {t('order.product_list')}
                                </Typography.Text>
                            </Row>

                            <List
                                itemLayout="horizontal"
                                dataSource={orderDetails}
                                renderItem={(orderDetail) => (
                                    <List.Item
                                        key={orderDetail?._id}
                                        actions={[
                                            <EditProductModal
                                                id={
                                                    (
                                                        orderDetail?.product as ProductProps
                                                    )?._id
                                                }
                                                orderDetail={orderDetail}
                                            />,
                                            <ConfirmRender
                                                buttonRender={
                                                    <Tooltip
                                                        title={t(
                                                            'product.delete',
                                                        )}
                                                    >
                                                        <Button
                                                            shape="circle"
                                                            icon={
                                                                <DeleteOutlined />
                                                            }
                                                            className="btn-delete"
                                                        />
                                                    </Tooltip>
                                                }
                                                handleConfirm={() =>
                                                    handleDelete(orderDetail)
                                                }
                                                content={t(
                                                    'product.confirm_delete',
                                                )}
                                                title={t(
                                                    'product.confirm_delete_title',
                                                )}
                                            />,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <Typography.Text>
                                                    {
                                                        (
                                                            orderDetail?.product as ProductProps
                                                        )?.productName
                                                    }
                                                </Typography.Text>
                                            }
                                            description={
                                                <Flex align="center">
                                                    <Avatar
                                                        shape="circle"
                                                        size={'small'}
                                                        style={{
                                                            background: (
                                                                orderDetail?.color as ProductColorsProps
                                                            )?.hex,
                                                            width: 12,
                                                            height: 12,
                                                            marginRight: 3,
                                                        }}
                                                    />
                                                    {
                                                        (
                                                            orderDetail?.color as ProductColorsProps
                                                        )?.colorName
                                                    }
                                                    <Slash />
                                                    {
                                                        (
                                                            orderDetail?.size as ProductSizeProps
                                                        )?.sizeName
                                                    }
                                                    <Slash />
                                                    {`x${orderDetail?.quantity}`}
                                                    <Slash />
                                                    {Number(
                                                        orderDetail?.price,
                                                    )?.toLocaleString()}
                                                </Flex>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    );
};

export default OrderCreateInfo;
