import { ProductColorsProps } from '@/models/product-color';
import ModalRender from '@/modules/shared/modal/ModalRender';
import { useDisclosure } from '@/utils/modal';
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Tooltip,
    Typography,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { IoMdResize } from 'react-icons/io';
import classes from '../../scss/product.module.scss';
import FormItem from 'antd/es/form/FormItem';
import { RULES_FORM } from '@/utils/validator';
import {
    useCreateSize,
    useRemoveSize,
    useUpdateSize,
} from '@/loaders/size.loader';
import { queryClient } from '@/lib/react-query';
import { useState } from 'react';
import { ProductSizeProps } from '@/models/product-size';
import { CACHE_COLOR, useGetByIdColor } from '@/loaders/color.loader';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';

interface Props {
    choosedColor?: ProductColorsProps;
}

const { useToken } = theme;

const ProductSizes = ({ choosedColor }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { isOpen, open, close } = useDisclosure();
    const { token } = useToken();
    const [form] = useForm();
    const [choosedSize, setChoosedSize] = useState<ProductSizeProps>();

    const currentColor = useGetByIdColor({
        id: choosedColor?._id || '',
        config: {
            onSuccess: () => {},
            onError: (error: any) => {
                form.resetFields();

                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const createSize = useCreateSize({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLOR.GET_BY_ID]);

                notification.success({
                    message: t('product.create_success'),
                });

                handleRefresh();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const updateSize = useUpdateSize({
        id: choosedSize?._id || '',
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_COLOR.GET_BY_ID]);

                notification.success({
                    message: t('product.update_success'),
                });

                handleRefresh();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const deleteSize = useRemoveSize({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_COLOR.GET_BY_ID]);

                notification.success({
                    message: t('product.delete_success'),
                });

                handleRefresh?.();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleRefresh = () => {
        form.resetFields();
        setChoosedSize(undefined);
    };

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleChoosedSize = (size: ProductSizeProps) => {
        setChoosedSize(size);
        form.setFieldsValue({ ...size });
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                if (choosedSize?._id) {
                    updateSize.mutate({
                        ...values,
                        color: currentColor?.data?._id,
                        quantity: 0,
                    });
                } else {
                    createSize.mutate({
                        ...values,
                        color: currentColor?.data?._id,
                        quantity: 0,
                    });
                }
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    const handleDelete = () => {
        deleteSize.mutate(choosedSize?._id || '');
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={<Typography.Text>{t('product.size')}</Typography.Text>}
                buttonRender={
                    <Tooltip title={t('product.size')}>
                        <Button
                            shape="circle"
                            icon={<IoMdResize />}
                            onClick={handleOpen}
                            style={{ marginLeft: 15 }}
                            disabled={!choosedColor?._id}
                        />
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                hideOkButton
            >
                {currentColor?.isLoading ? (
                    <Flex
                        align="center"
                        justify="center"
                        style={{ height: '100%' }}
                    >
                        <div
                            className="loader"
                            style={{ background: token.colorPrimary }}
                        ></div>
                    </Flex>
                ) : (
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={12} lg={12}>
                            <Form form={form}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.size_name')}
                                    name="sizeName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('product.size_name')}
                                    />
                                </FormItem>
                            </Form>

                            <Flex align="center" justify="end">
                                <Tooltip title={t('product.create_size')}>
                                    <Button
                                        loading={createSize?.isLoading}
                                        type="primary"
                                        shape="circle"
                                        icon={<PlusOutlined />}
                                        onClick={handleSubmit}
                                        style={{ marginLeft: 10 }}
                                        disabled={!!choosedSize?._id}
                                    />
                                </Tooltip>
                                <Tooltip title={t('product.update_size')}>
                                    <Button
                                        loading={updateSize?.isLoading}
                                        type="primary"
                                        shape="circle"
                                        icon={<EditOutlined />}
                                        onClick={handleSubmit}
                                        style={{ marginLeft: 10 }}
                                        disabled={!choosedSize?._id}
                                    />
                                </Tooltip>
                                <ConfirmRender
                                    buttonRender={
                                        <Tooltip
                                            title={t('product.delete_size')}
                                        >
                                            <Button
                                                loading={deleteSize?.isLoading}
                                                shape="circle"
                                                icon={<DeleteOutlined />}
                                                className="btn-delete"
                                                style={{ marginLeft: 10 }}
                                                disabled={!choosedSize?._id}
                                            />
                                        </Tooltip>
                                    }
                                    handleConfirm={() => handleDelete()}
                                    content={t('product.confirm_delete_size')}
                                    title={t('product.confirm_delete_title')}
                                />

                                <Tooltip title={t('product.refresh')}>
                                    <Button
                                        shape="circle"
                                        icon={<ReloadOutlined />}
                                        onClick={() => handleRefresh()}
                                        style={{ marginLeft: 10 }}
                                        className="btn-refresh"
                                    />
                                </Tooltip>
                            </Flex>
                        </Col>
                        <Col span={24} md={12} lg={12}>
                            {currentColor?.data?.sizes?.length == 0 ? (
                                <>({t('product.empty_size')})</>
                            ) : (
                                currentColor?.data?.sizes?.map(
                                    (size: ProductSizeProps) => (
                                        <Tooltip title={size?.sizeName}>
                                            <Button
                                                className={classes.item}
                                                onClick={() =>
                                                    handleChoosedSize(size)
                                                }
                                            >
                                                {size?.sizeName}
                                            </Button>
                                        </Tooltip>
                                    ),
                                )
                            )}
                        </Col>
                    </Row>
                )}
            </ModalRender>
        </>
    );
};

export default ProductSizes;
