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
import { INVOICE_PAIDS } from '@/constants/config';
import { ProductProps } from '@/models/product';
import { ProductColorsProps } from '@/models/product-color';
import { ProductSizeProps } from '@/models/product-size';
import Slash from '@/modules/shared/divider/slash/Slash';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import {
    CACHE_INVOICE,
    useGetByCodeInvoice,
    useUpdateInvoice,
} from '@/loaders/invoice.loader';
import { useLocation } from 'react-router-dom';
import { getSlugify } from '@/utils/path';
import { InvoiceDetailProps } from '@/models/invoice-detail';
import { queryClient } from '@/lib/react-query';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import { TiArrowBackOutline } from 'react-icons/ti';

const ImportBillEditInfo = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { pathname } = useLocation();
    const [form] = useForm();

    const getByCode = useGetByCodeInvoice({
        params: {
            invoiceCode: getSlugify(pathname),
        },
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                    paid: String(response?.paid),
                    total: Number(response?.total)?.toLocaleString()
                });
                form.setFieldValue('staff', response?.staff?.staffName);
                form.setFieldValue(
                    'total_calculate',
                    Number(
                    response?.invoiceDetails?.reduce(
                        (acc: number, item: InvoiceDetailProps) =>
                            acc +
                            Number(item?.quantity) * Number(item?.priceImport),
                        0,
                    ))?.toLocaleString(),
                );
                setTextContent(response?.note);
            },
        },
    });

    const [transportFee, setTransportFee] = useState<number>(0);
    const [textContent, setTextContent] = useState<string>('');

    const updateInvoice = useUpdateInvoice({
        id: getByCode?.data?._id,
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_INVOICE.SEARCH]);

                notification.success({
                    message: t('invoice.update_success'),
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
            (getByCode?.data?.invoiceDetails?.reduce(
                (acc: number, item: InvoiceDetailProps) =>
                    acc + Number(item?.quantity) * Number(item?.priceImport),
                0,
            ) + Number(transportFee)))?.toLocaleString()
            ,
        );
    }, [transportFee]);

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                updateInvoice.mutate({
                    ...values,
                    invoiceDetails: getByCode?.data?.invoiceDetails,
                    note: textContent,
                    staff: getByCode?.data?.staff?._id,
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
    }

    return (
        <>
            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t('invoice.back')}>
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
                    title={t('invoice.import_bill_info')}
                    extra={
                        <Button
                            loading={updateInvoice?.isLoading}
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSubmit}
                        >
                            {t('invoice.save')}
                        </Button>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={12} lg={12}>
                            <Form form={form} layout="vertical">
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'staff'}
                                    label={t('invoice.fields.staff')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('invoice.fields.staff')}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'invoiceCode'}
                                    label={t('invoice.fields.invoice_code')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'invoice.fields.invoice_code',
                                        )}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'total_calculate'}
                                    label={t('invoice.fields.total')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('invoice.fields.total')}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'transportFee'}
                                    label={t('invoice.fields.transport_fee')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'invoice.fields.transport_fee',
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
                                    label={t('invoice.fields.total_calculate')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t(
                                            'invoice.fields.total_calculate',
                                        )}
                                        readOnly
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 10 }}
                                    name={'paid'}
                                    label={t('invoice.fields.paid_status')}
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        options={INVOICE_PAIDS}
                                        placeholder={t(
                                            'invoice.fields.paid_status',
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
                                    {t('invoice.product_list')}
                                </Typography.Text>
                            </Row>

                            <List
                                loading={getByCode?.isLoading}
                                itemLayout="horizontal"
                                dataSource={getByCode?.data?.invoiceDetails}
                                renderItem={(
                                    invoiceDetail: InvoiceDetailProps,
                                ) => (
                                    <List.Item key={invoiceDetail?._id}>
                                        <List.Item.Meta
                                            title={
                                                <Typography.Text>
                                                    {
                                                        (
                                                            invoiceDetail?.product as ProductProps
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
                                                                invoiceDetail?.color as ProductColorsProps
                                                            )?.hex,
                                                            width: 12,
                                                            height: 12,
                                                            marginRight: 3,
                                                        }}
                                                    />
                                                    {
                                                        (
                                                            invoiceDetail?.color as ProductColorsProps
                                                        )?.colorName
                                                    }
                                                    <Slash />
                                                    {
                                                        (
                                                            invoiceDetail?.size as ProductSizeProps
                                                        )?.sizeName
                                                    }
                                                    <Slash />
                                                    {`x${invoiceDetail?.quantity}`}
                                                    <Slash />
                                                    {Number(
                                                        invoiceDetail?.priceImport,
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

export default ImportBillEditInfo;
