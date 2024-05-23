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
import { INVOICE_PAIDS } from '@/constants/config';
import { useInvoiceDetailState } from '@/stores/invoice-detail.store';
import { ProductProps } from '@/models/product';
import { ProductColorsProps } from '@/models/product-color';
import { ProductSizeProps } from '@/models/product-size';
import EditProductModal from './EditProductModal';
import Slash from '@/modules/shared/divider/slash/Slash';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import { InvoiceDetailProps } from '@/models/invoice-detail';
import { useGetMe } from '@/loaders/auth.loader';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { REACT_QUILL_FORMAT, REACT_QUILL_MODULES } from '@/utils/react-quill';
import { CACHE_INVOICE, useCreateInvoice } from '@/loaders/invoice.loader';
import { queryClient } from '@/lib/react-query';

const ImportBillCreateInfo = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const [form] = useForm();

    const currentUsers = useGetMe({
        config: {
            onSuccess: (response) => {
                form.setFieldValue('staff', response?.staff?.staffName);
            },
        },
    });
    const [transportFee, setTransportFee] = useState<number>(0);
    const [textContent, setTextContent] = useState<string>('');

    const [invoiceDetails, setInvoiceDetails] = useInvoiceDetailState(
        (state) => [state.invoiceDetails, state.setInvoiceDetails],
    );

    const createInvoice = useCreateInvoice({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_INVOICE.SEARCH]);

                notification.success({
                    message: t('invoice.create_success'),
                });

                setInvoiceDetails([])
                setTextContent("")
                setTransportFee(0);
                form.resetFields();
                form.setFieldValue('staff', currentUsers?.data?.staff?.staffName);
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleDelete = (invoiceDetail: InvoiceDetailProps) => {
        setInvoiceDetails(
            invoiceDetails?.filter(
                (d: InvoiceDetailProps) =>
                    (d?.product as ProductProps)?._id !=
                        (invoiceDetail?.product as ProductProps)?._id &&
                    (d?.color as ProductColorsProps)?._id !=
                        (invoiceDetail?.color as ProductColorsProps)?._id &&
                    (d?.size as ProductSizeProps)?._id !=
                        (invoiceDetail?.size as ProductSizeProps)?._id,
            ),
        );
    };

    useEffect(() => {
        form.setFieldValue(
            'total_calculate',
            Number(invoiceDetails?.reduce(
                (acc, item) =>
                    acc + Number(item?.quantity) * Number(item?.priceImport),
                0,
            ))?.toLocaleString(),
        );
        form.setFieldValue(
            'total',
            Number(invoiceDetails?.reduce(
                (acc, item) =>
                    acc + Number(item?.quantity) * Number(item?.priceImport),
                0,
            ) + Number(transportFee))?.toLocaleString(),
        );
    }, [invoiceDetails, transportFee]);

    const handleSubmit = () => {

        form.validateFields()
            .then(async (values) => {
                createInvoice.mutate({
                    ...values,
                    details: invoiceDetails,
                    staff: currentUsers?.data?.staff?._id,
                    note: textContent,
                    total: parseFloat(values?.total?.replace(/[^0-9.-]+/g, ''))
                })
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
                    style={{ minHeight: 900}}
                    title={t('invoice.import_bill_info')}
                    extra={
                        <Button
                            loading={createInvoice?.isLoading}
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
                                itemLayout="horizontal"
                                dataSource={invoiceDetails}
                                renderItem={(invoiceDetail) => (
                                    <List.Item
                                        key={invoiceDetail?._id}
                                        actions={[
                                            <EditProductModal
                                                id={
                                                    (
                                                        invoiceDetail?.product as ProductProps
                                                    )?._id
                                                }
                                                invoiceDetail={invoiceDetail}
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
                                                    handleDelete(invoiceDetail)
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

export default ImportBillCreateInfo;
