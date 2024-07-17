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
import { SaveOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { RULES_FORM } from '@/utils/validator';
import { ProductProps } from '@/models/product';
import { ProductColorsProps } from '@/models/product-color';
import { ProductSizeProps } from '@/models/product-size';
import Slash from '@/modules/shared/divider/slash/Slash';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import {
    CACHE_ORDER,
    useGetByCodeOrder,
    useUpdateOrder,
} from '@/loaders/order.loader';
import { useLocation } from 'react-router-dom';
import { getSlugify } from '@/utils/path';
import { OrderDetailProps } from '@/models/order-detail';
import { queryClient } from '@/lib/react-query';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { TiArrowBackOutline } from 'react-icons/ti';
import {
    ORDERS_PAIDS,
    ORDERS_PAYMENTS,
    ORDERS_STATUSES,
} from '@/constants/config';
import { REGIONS } from '@/constants/region';
import {
    DistrictProps,
    ProvinceProps,
    WardProps,
} from '@/models/delivery-address';
import TextArea from 'antd/es/input/TextArea';

const OrderEditInfo = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'sell' });
    const { pathname } = useLocation();
    const [form] = useForm();

    const getInfoDeliveryAddress = (id: string, type: number) => {
        if (type == 1) {
            const province = REGIONS.find((item) => item.Id == id);
            return province as ProvinceProps;
        }

        if (type == 2) {
            const districts = REGIONS.map((item) => item.Districts).flat(1);
            const district = districts.find((item) => item.Id == id);
            return district as DistrictProps;
        }

        if (type == 3) {
            const districts = REGIONS.map((item) => item.Districts).flat(1);
            const wards = districts.map((item) => item.Wards).flat(1);
            const ward = wards.find((item: any) => item.Id == id);
            return ward as WardProps;
        }
    };

    const getByCode = useGetByCodeOrder({
        params: {
            ordersCode: getSlugify(pathname),
        },
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                    status: String(response?.status),
                    payment: String(response?.payment),
                    paid: String(response?.paid),
                    total: Number(response?.total)?.toLocaleString(),
                });
                form.setFieldValue(
                    'address',
                    `${response?.deliveryAddress?.consigneeName}, ${response?.deliveryAddress?.consigneePhone}, ${
                        response?.deliveryAddress.country == 1
                            ? `${response?.deliveryAddress.deliveryAddressName}, ${
                                  getInfoDeliveryAddress(
                                      response?.deliveryAddress.province,
                                      1,
                                  )?.Name
                              }, ${
                                  getInfoDeliveryAddress(
                                      response?.deliveryAddress.district,
                                      2,
                                  )?.Name
                              }, ${
                                  getInfoDeliveryAddress(
                                      response?.deliveryAddress.ward,
                                      3,
                                  )?.Name
                              }`
                            : response?.deliveryAddress.deliveryAddressName
                    }
                    `,
                );
                form.setFieldValue(
                    'customer',
                    response?.customer
                        ? response?.customer?.customerName
                        : t('order.customer_direct'),
                );
                form.setFieldValue(
                    'total_calculate',
                    Number(
                        response?.ordersDetails?.reduce(
                            (acc: number, item: OrderDetailProps) =>
                                acc +
                                Number(item?.quantity) * Number(item?.price),
                            0,
                        ),
                    )?.toLocaleString(),
                );
                setTextContent(response?.note);
            },
        },
    });

    const [transportFee, setTransportFee] = useState<number>(0);
    const [textContent, setTextContent] = useState<string>('');

    const updateOrder = useUpdateOrder({
        id: getByCode?.data?._id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_ORDER.SEARCH]);

                notification.success({
                    message: t('order.update_success'),
                });
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    useEffect(() => {
        form.setFieldValue(
            'total',
            Number(
                getByCode?.data?.ordersDetails?.reduce(
                    (acc: number, item: OrderDetailProps) =>
                        acc + Number(item?.quantity) * Number(item?.price),
                    0,
                ) + Number(transportFee),
            )?.toLocaleString(),
        );
    }, [transportFee]);

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                updateOrder.mutate({
                    ...values,
                    ordersDetails: getByCode?.data?.ordersDetails,
                    note: textContent,
                    customer: getByCode?.data?.customer?._id || null,
                    total: parseFloat(values?.total?.replace(/[^0-9.-]+/g, '')),
                });
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t('order.back')}>
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<TiArrowBackOutline />}
                                    onClick={() => handleBack()}
                                />
                            </Tooltip>
                        </Flex>
                    </>
                }
            />
            <div className="layout">
                <Card
                    style={{ minHeight: 1024 }}
                    title={t('order.order_bill_info')}
                    extra={
                        <Button
                            loading={updateOrder?.isLoading}
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
                                    name={'address'}
                                    label={t('order.fields.delivery_address')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <TextArea
                                        placeholder={t(
                                            'order.fields.delivery_address',
                                        )}
                                        rows={4}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'ordersCode'}
                                    label={t('order.fields.order_code')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'order.fields.order_code',
                                        )}
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
                                loading={getByCode?.isLoading}
                                itemLayout="horizontal"
                                dataSource={getByCode?.data?.ordersDetails}
                                renderItem={(orderDetail: OrderDetailProps) => (
                                    <List.Item key={orderDetail?._id}>
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

export default OrderEditInfo;
