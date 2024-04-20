
import MainNavbar from '../../components/main-navbar/MainNavbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button, Modal, Table } from 'antd';

export default function AddSupplier() {
    const [clientFormData, setClientFormData] = useState({
        name: '',
        whatsapp: '',
        service_provided: '',
        amount: 0,
        email: '',
    });

    const [suppliers, setSuppliers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('https://gdcompanion-prod.onrender.com/buscar-fornecedores');
            console.log("Dados recebidos:", response.data);
            // Apenas para debug, verifique a estrutura
            if(Array.isArray(response.data) && response.data.length > 0) {
                console.log("Primeiro elemento:", response.data[0]);
                // Tentativa de correção, caso a estrutura seja como esperado
                setSuppliers(response.data[0]);
            } else {
                console.error("Formato inesperado dos dados:", response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
        }
    };
    
    useEffect(() => { // DONE
        fetchSuppliers();
    
        // Retorno da função de efeito para limpar o estado ao desmontar o componente
        return () => {
            setSuppliers([]); // Limpar o estado ao desmontar o componente para evitar vazamentos de memória
        };
    }, []);
     

    const handleClientFormChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setClientFormData({
            ...clientFormData,
            [name]: name === 'amount' ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            // Enviar dados do fornecedor para o servidor
            const response = await axios.post('https://gdcompanion-prod.onrender.com/inserir-fornecedor', clientFormData);
            console.log('Resposta do servidor:', response);
            Swal.fire({
                icon: 'success',
                title: 'Fornecedor cadastrado com sucesso!',
                text: 'Agora você pode ver o fornecedor na lista abaixo.',
            });
            fetchSuppliers(); // Atualizar lista de fornecedores
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao cadastrar fornecedor',
                text: 'Tente novamente mais tarde.',
            });

            console.error('Erro ao enviar dados do fornecedor para o servidor:', error);
        }
    };

    // const editSupplier = (supplier: any) => {
    //     Swal.fire({
    //         title: 'Editar Fornecedor',
    //         html: `<input id="swal-input1" class="swal2-input" placeholder="Nome" value="${supplier.name}">
    //                <input id="swal-input2" class="swal2-input" placeholder="WhatsApp" value="${supplier.whatsapp}">
    //                <input id="swal-input3" class="swal2-input" placeholder="Serviço Fornecido" value="${supplier.service_provided}">
    //                <input id="swal-input4" class="swal2-input" placeholder="Valor" type="number" value="${supplier.amount}">
    //                <input id="swal-input5" class="swal2-input" placeholder="Email" value="${supplier.email}">`,
    //         focusConfirm: false,
    //         preConfirm: () => {
    //             return {
    //                 name: (document.getElementById('swal-input1') as HTMLInputElement).value,
    //                 whatsapp: (document.getElementById('swal-input2') as HTMLInputElement).value,
    //                 service_provided: (document.getElementById('swal-input3') as HTMLInputElement).value,
    //                 amount: (document.getElementById('swal-input4') as HTMLInputElement).value,
    //                 email: (document.getElementById('swal-input5') as HTMLInputElement).value,
    //             }
    //         }
    //     }).then((result) => {
    //         if (result.isConfirmed && result.value) {
    //             // Aqui você pode chamar uma função para atualizar os dados do fornecedor
    //             console.log('Dados atualizados:', result.value);
    //             // Supondo uma função updateSupplier() que atualiza os dados no backend
    //             // updateSupplier(supplier.id, result.value);
    //             updateSupplier(result.value);
    //         }
    //     });
    // };
// Função para atualizar fornecedor no frontend
// const updateSupplier = async (supplierData: any) => {
//     const { id, ...dataToUpdate } = supplierData; // Desestruturação para separar o ID dos demais dados

//     try {
//         // Realiza a chamada PATCH para o endpoint de atualização
//         const response = await axios.patch(`https://gdcompanion-prod.onrender.com/atualizar-fornecedor/${id}`, dataToUpdate);

//         // Se a chamada foi bem-sucedida, exibe uma mensagem de sucesso
//         Swal.fire({
//             icon: 'success',
//             title: 'Fornecedor Atualizado!',
//             text: response.data.message,
//         });

//         // Atualiza a lista de fornecedores para refletir as mudanças (chame a função que faz isso)
//         fetchSuppliers();
//     } catch (error) {
//         // Se ocorreu um erro, exibe uma mensagem de erro
//         console.error('Erro ao atualizar fornecedor:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'Erro ao Atualizar!',
//             text: 'Não foi possível atualizar o fornecedor.',
//         });
//     }
// };

    
    
    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'WhatsApp',
            dataIndex: 'whatsapp',
            key: 'whatsapp',
        },
        {
            title: 'Serviço Fornecido',
            dataIndex: 'service_provided',
            key: 'service_provided',
        },
        {
            title: 'Valor',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Ação',
            key: 'action',
            // render: (_text: any, record: any) => (
            //     <Button onClick={() => editSupplier(record)}>Editar</Button>
                
            // ),
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    return (
        <>
            <MainNavbar />
   
            <div className='the-big-container'>
            
                <h1 className='the-title'>Cadastrar Fornecedor</h1>
                <div className="container">
                    <form className="the-form" onSubmit={handleSubmit}>
                       

                    <input
                type="text"
                name="name"
                value={clientFormData.name}
                onChange={handleClientFormChange}
                placeholder="Nome do Cliente"
              /> <br />
              <input
                type="text"
                name="whatsapp"
                value={clientFormData.whatsapp}
                onChange={handleClientFormChange}
                placeholder="WhatsApp"
              /><br/>

              <input
                type="text"
                name="service_provided"
                value={clientFormData.service_provided}
                onChange={handleClientFormChange}
                placeholder="Serviço Fornecido"
              /> <br/>
              <input
         
                type="number"
                name="amount"
                value={clientFormData.amount}
                onChange={handleClientFormChange}
                placeholder="Valor"
              /><br/>
              <input
              type="email"
              name="email"
              value={clientFormData.email}
              onChange={handleClientFormChange}
              placeholder="Email do Cliente"
            /><br/>
        



                        <button type="submit">ENVIAR</button>
                    </form>

                    <Button type="primary" onClick={showModal}>
                Mostrar Fornecedores
            </Button>
            <Modal
                title="Lista de Fornecedores"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800} // Ajuste a largura conforme necessário
                >
                <Table
                    dataSource={suppliers}
                    columns={columns}
                    rowKey="id"
                />
            </Modal>
                </div>
            </div>
        </>
    );
}