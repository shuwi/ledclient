/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50721
Source Host           : localhost:3306
Source Database       : labour

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2018-11-28 17:12:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idType` int(255) NOT NULL,
  `idNumber` varchar(255) NOT NULL,
  `jobType` int(255) NOT NULL,
  `cerName` varchar(255) NOT NULL,
  `validBeginDate` date NOT NULL,
  `validEndDate` date NOT NULL,
  `issueby` varchar(255) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `status` int(2) NOT NULL,
  `cerNo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='资格证信息表';

-- ----------------------------
-- Table structure for classno
-- ----------------------------
DROP TABLE IF EXISTS `classno`;
CREATE TABLE `classno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '班组名称',
  `teamLeader` varchar(255) DEFAULT NULL COMMENT '联系人',
  `contract` varchar(255) DEFAULT NULL COMMENT '联系方式',
  `teamIdNumber` varchar(255) DEFAULT NULL COMMENT '班组长身份证号码',
  `responseIdNumber` varchar(255) DEFAULT NULL COMMENT '责任人身份证号码',
  `memo` varchar(255) DEFAULT NULL COMMENT '备注',
  `createUser` varchar(255) DEFAULT NULL,
  `projectId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='班组信息表';

-- ----------------------------
-- Table structure for machine
-- ----------------------------
DROP TABLE IF EXISTS `machine`;
CREATE TABLE `machine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `port` int(6) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `mname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='考勤机信息表';

-- ----------------------------
-- Table structure for worker
-- ----------------------------
DROP TABLE IF EXISTS `worker`;
CREATE TABLE `worker` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `userId` varchar(255) NOT NULL COMMENT '身份证号',
  `name` varchar(255) NOT NULL COMMENT '人员姓名',
  `mobile` varchar(255) NOT NULL COMMENT '电话号码',
  `job` varchar(255) DEFAULT NULL,
  `groupname` varchar(255) DEFAULT NULL,
  `addtime` varchar(255) DEFAULT NULL,
  `checkinState` int(2) NOT NULL DEFAULT '0',
  `checkinTime` datetime DEFAULT NULL,
  `photo` longtext NOT NULL,
  `projectId` int(11) NOT NULL,
  `workDate` date DEFAULT NULL COMMENT '开始工作日期',
  `urgentContractCellphone` varchar(255) DEFAULT NULL COMMENT '紧急联系人电话',
  `urgentContractName` varchar(255) DEFAULT NULL COMMENT '紧急联系人',
  `noBadMedicalHistory` varchar(1) DEFAULT '0' COMMENT '是否有重大病史',
  `cultureLevelType` varchar(255) DEFAULT NULL COMMENT '文化程度',
  `joinedTime` date DEFAULT NULL COMMENT '加入工会时间',
  `unJoined` varchar(1) DEFAULT '0' COMMENT '是否加入公会',
  `politicsType` varchar(255) DEFAULT NULL COMMENT '政治面貌',
  `birthPlaceCode` varchar(255) DEFAULT NULL COMMENT '籍贯',
  `nation` varchar(255) DEFAULT NULL COMMENT '民族',
  `idCardType` int(255) DEFAULT NULL COMMENT '证件类型',
  `classNo` varchar(255) DEFAULT NULL COMMENT '班组',
  `personType` varchar(255) DEFAULT NULL COMMENT '人员类型',
  `homeAddress` varchar(255) DEFAULT NULL COMMENT '家庭住址',
  `workKind` int(6) DEFAULT NULL COMMENT '工种',
  `birthday` varchar(255) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL COMMENT '性别',
  `ptype` varchar(1) DEFAULT NULL COMMENT '人员类别',
  `currentAddresss` varchar(255) DEFAULT NULL COMMENT '暂住地址',
  `workAccommodationType` varchar(1) DEFAULT '0' COMMENT '工人住宿类型',
  `workKindType` varchar(1) DEFAULT '1' COMMENT '工种类别',
  `beginnew` varchar(255) DEFAULT NULL,
  `endnew` varchar(255) DEFAULT NULL,
  `uploaded` int(2) DEFAULT '0' COMMENT '是否已上传',
  `inState` varchar(255) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工人信息表';
