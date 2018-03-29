import React, { Component } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

import mount from './mount.js'

import { Row, Col } from 'react-bootstrap'
import Navigation from './components/Navigation.js'
import Timeline from './components/Timeline.js'
import Footer from './components/Footer.js'

import './styles/Home.scss'

import viz from './assets/js/viz.js'

// Markdown
import about from './markdown/about.md'
import why from './markdown/why.md'
import overview from './markdown/overview.md'
import faq from './markdown/faq.md'
import challenges from './markdown/challenges.md'

class Index extends Component {
  componentDidMount() {
    viz('viz')
  }

  render() {
    let status
    if (canUseDOM && sessionStorage.getItem('jwt')) {
      status = 'loggedIn'
    } else {
      status = 'loggedOut'
    }

    return(
      <div className="fillY">
        <Navigation title="" status={status} />
        <div className="Splash">
          <div id="viz" />
          <div className="headerPush" />
          <img id="splashLogo" className="aboveCanvas" src="/img/homepageLogo2018.png" />
          <i id="downArrow" className="fa fa-arrow-down"></i>
        </div>
        <div id="results" className="container">
          <h2> Results </h2>
          <table>
            <tr>
              <th>Place</th>
              <th>Team Name</th>
              <th>Project Name</th>
              <th>Members</th>
            </tr>
            <tr>
              <td>1</td>
              <td>GenomeLabs</td>
              <td><a href="https://github.com/dennlinger/GenomeLabs">Gene Body Atlas</a></td>
              <td>Dennis Aumiller, Ray Gao, Musa Talluzi</td>
            </tr>
            <tr>
              <td>2</td>
              <td>ProteoWizards</td>
              <td>
                <a href="https://github.com/ProteoWizards/UniqViz">Human Uniqueness Map</a> (<a href="slides/proteowizards.pdf">slides</a>)
              </td>
              <td>Max Frank, Aleksei Shkurin, Ron Blutrich, Paul Frank, Julian Mazzitelli, Hailen Xu, Charlotte Nguyen</td>
            </tr>
            <tr>
              <td>3</td>
              <td>SadCricket</td>
              <td>
                <a href="https://github.com/jyjenny/bcbbiohacks2018/">Hills With A Halo</a> (<a href="slides/sadcricket.png">slides</a>)
              </td>
              <td>Jenny Yin, Alana Man, Yuqing Zou, Justin Lee, Ian Shi</td>
            </tr>
            <tr>
              <td>Top 6</td>
              <td>A TAD Tired</td>
              <td>
                <a href="https://github.com/LyMarco/2018-Challenge">TAD Viewer</a> (<a href="slides/tad.pdf">slides</a>)
              </td>
              <td>Ashley Wang, Srishti Sehgal, Marco Ly, Frederick Zhang</td>
            </tr>
            <tr>
              <td>Top 6</td>
              <td>BioCompBaes</td>
              <td>
                <a href="https://github.com/kashishverma610/BioHacks2018">Predicting gene functionality based on location</a> (<a href="slides/biocompbaes.pdf">slides</a>)
              </td>
              <td>Kashish Verma, Christine Bui, Afifa Saleem, Samia Muqeem</td>
            </tr>
            <tr>
              <td>Top 6</td>
              <td>Don't Do Shrugs Kids</td>
              <td>
                <a href="https://github.com/rkchudha/BioHacks.git">Gene Interaction...and 👉YOU</a> (<a href="slides/dont-do-shrugs-kids.pdf">slides</a>)
              </td>
              <td>Hammad K., Xi H., Nada E., Tanith J., Alison L., Ramnik C.</td>
            </tr>
            <tr>
              <td></td>
              <td>AAA</td>
              <td><a href="https://github.com/li-amy/uoftbiohacks2018">Relationship Graph</a></td>
              <td>Amy Li, Alex Chen</td>
            </tr>
            <tr>
              <td></td>
              <td>pizzasquad</td>
              <td><a href="https://github.com/ignaspa/concentricgraf">Pizza Graph</a></td>
              <td>Bruno, <a href="https://github.com/ignaspa">ignaspa</a>, Sid, Ben, John, Santiago</td>
            </tr>
            <tr>
              <td></td>
              <td>Hackthonians</td>
              <td><a href="https://github.com/shiseru/biohacks">BioHacks Project</a></td>
              <td>Sotaro Hirai, Shisei Naka</td>
            </tr>
          </table>
        </div>
        <div className="registerBlock">
          <div className="container">
            <Row style={{marginBottom: '30px'}}>
              <Col xs={12} md={8} mdOffset={2}>
                <div className="panel my-panel-default grey" style={{marginBottom: '0'}}>
                  <div className="my-panel-body">
                    <h2 style={{textAlign: 'center'}}><i className="fa fa-calendar"></i> March 17-18 2018</h2>

                { null ?
                  <div className="buttonHolder">
                  <a className="btn btn-primary btn-lg" href="https://goo.gl/forms/V3ujQb3Wt1qNXMYr1">Volunteer</a>
                  <a className="btn btn-primary btn-lg" href="/BCB-biohacks-2018-sponsor-package.pdf">Sponsor</a>
                  </div>
                  : undefined
                }
                  </div>
                  { null ? <hr /> : undefined}
                  <div id="intro" dangerouslySetInnerHTML={{__html: about}} />
                  <div style={{textAlign: 'center'}}>
                    <img style={{width: '60%', paddingBottom: '20px'}} src="/img/BCB.png" />
                    <br></br>
                    <a target="_blank" href="https://cssu.ca/"><img style={{width: '25%'}} src="/img/cssu.png" /></a>
                  </div>
                </div>
                <div className="downTriangle light" style={{marginBottom: '-10%'}}/>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{backgroundColor: '#eee'}}>
          <Timeline />
        </div>
        <div style={{backgroundColor: '#eee'}}>
          <div className="downTriangle up" style={{backgroundColor: 'rgba(0,0,0,0)', marginTop: '-9%'}}/>
        </div>
        <div className="darkBlock">
          <div className="container">
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <div className="downTriangle up light" style={{backgroundColor: 'rgba(0,0,0,0)', marginTop: '-20%'}}/>
                <div className="panel my-panel-default grey">
                  <div className="my-panel-body">
                    <h2 style={{textAlign: 'center'}}>About BioHacks</h2>
                    <div id="why" dangerouslySetInnerHTML={{__html: why}} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="lightBlock2">
          <div className="container">
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <div className="panel my-panel-default">
                  <div className="my-panel-body">
                    <div id="faq" dangerouslySetInnerHTML={{__html: challenges}} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="darkBlock2" style={{paddingTop: '15px'}}>
          <div className="container">
            <Row>
              <Col className="sponsors-wrapper" xs={12} md={8} mdOffset={2} style={{textAlign: 'center'}}>
                <div className="panel my-panel-default">
                  <div className="my-panel-body">
                    <h2>Sponsors</h2>
                    <a target="_blank" href="http://web.cs.toronto.edu/"><img style={{width: '50%', paddingTop: '20px'}} src="/img/dcs.png" /></a>
                    <br></br>
                    <a target="_blank" href="http://www.mclaughlin.utoronto.ca/"><img style={{width: '50%', paddingTop: '20px'}} src="/img/MC_logo_Centered_RGB.jpg" /></a>
                    <br></br>
                    <a target="_blank" href="http://www.cagef.utoronto.ca/"><img style={{width: '50%', paddingTop: '20px'}} src="/img/CAGEF_01-2_small-2.png" /></a>
                    <br></br>
                    <a target="_blank" href="https://awakechocolate.ca/"><img style={{width: '50%', paddingTop: '20px'}} src="/img/awake.png" /></a>

                    <p style={{paddingTop: '10px'}}>
                      If you are interested in becoming a sponsor, check out our <a href="/BCB-biohacks-2018-sponsor-package.pdf">sponsorship package</a>.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="darkBlock2">
          <div className="container">
            <Row>
              <Col className="sponsors-wrapper" xs={12} md={8} mdOffset={2} style={{textAlign: 'center'}}>
                <div className="panel my-panel-default">
                  <div className="my-panel-body">
                    <h2>Partners</h2>
                    <a href="http://igemtoronto.ca/"><img style={{width: '30%'}} src="/img/igem.png" /></a>
                    <a target="_blank" href="https://cssu.ca/"><img style={{paddingLeft: '20px', width: '30%'}} src="/img/cssu.png" /></a>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="lightBlock2">
          <div className="container">
            <Row>
              <Col xs={12} md={8} mdOffset={2}>
                <div className="panel my-panel-default">
                  <div className="my-panel-body">
                    <h2 style={{textAlign: 'center'}}>FAQ</h2>
                    <div id="faq" dangerouslySetInnerHTML={{__html: faq}} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default mount(Index)
