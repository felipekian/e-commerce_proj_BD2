-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 30-Jun-2019 às 17:16
-- Versão do servidor: 10.1.34-MariaDB
-- PHP Version: 7.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zettaByte`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `clientes`
--

CREATE TABLE `clientes` (
  `clienteID` int(10) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `senha` varchar(40) NOT NULL,
  `endereco` varchar(100) NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `cidade` varchar(20) NOT NULL,
  `bairro` varchar(30) NOT NULL,
  `nomecompleto` varchar(40) NOT NULL,
  `datacadastro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rg` varchar(20) NOT NULL,
  `cep` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `clientes`
--

INSERT INTO `clientes` (`clienteID`, `usuario`, `senha`, `endereco`, `cpf`, `email`, `cidade`, `bairro`, `nomecompleto`, `datacadastro`, `rg`, `cep`) VALUES
(1, 'felipekian10', 'd5a4b386c25de8dddf79c1396cb3638b', 'Rua da Gravioleira, Paraviana', '52547265265', 'felipekian@yahoo.com.br', 'Boa Vista', 'Paraviana', 'Felipe Derkian de Sousa Freitas', '2019-06-06 02:12:44', '3772934', '69307330'),
(2, 'felipekian', 'd5a4b386c25de8dddf79c1396cb3638b', 'Rua da Gravioleira, Paraviana', '02547265265', 'felipekian@yahoo.com.br', 'Boa Vista', 'Paraviana', 'Felipe Derkian de Sousa Freitas', '2019-06-06 02:13:24', '3772934', '69307330'),
(3, 'pires28', '6c8749438cc60ee5f82742326de6c112', 'Rua Itajara', '01401533350', 'junior-pires.rr@hotmail.com', 'Boa Vista', 'Jóquei Clube', 'Francisco Pires Junior', '2019-06-29 15:50:02', '205136', '69313022');

-- --------------------------------------------------------

--
-- Estrutura da tabela `funcionarios`
--

CREATE TABLE `funcionarios` (
  `funcionarioID` int(10) NOT NULL,
  `nomecompleto` varchar(100) NOT NULL,
  `rg` varchar(20) NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `funcao` varchar(20) NOT NULL,
  `setor` varchar(20) NOT NULL,
  `email` varchar(40) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `senha` varchar(40) NOT NULL,
  `datacontratado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bairro` varchar(30) NOT NULL,
  `cidade` varchar(30) NOT NULL,
  `endereco` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `funcionarios`
--

INSERT INTO `funcionarios` (`funcionarioID`, `nomecompleto`, `rg`, `cpf`, `telefone`, `funcao`, `setor`, `email`, `usuario`, `senha`, `datacontratado`, `bairro`, `cidade`, `endereco`) VALUES
(1, 'Felipe Derkian de Sousa Freitas', '3772900', '02547265265', '34234234234', 'Atendente', 'RMA', 'felipekian@yahoo.com.br', 'felipekian', 'd5a4b386c25de8dddf79c1396cb3638b', '2019-06-02 15:44:07', '', '', ''),
(2, 'Adalberto bobao', '258963', '31265479', '515151', 'Suporte', 'Suporte', 'adalberto@hotmail.com', 'adalberto', 'd5a4b386c25de8dddf79c1396cb3638b', '2019-06-06 01:37:29', 'Paraviana', 'Boa Vista', 'Rua Dionísio Brito de Araújo');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`clienteID`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- Indexes for table `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD PRIMARY KEY (`funcionarioID`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `clienteID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `funcionarios`
--
ALTER TABLE `funcionarios`
  MODIFY `funcionarioID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
